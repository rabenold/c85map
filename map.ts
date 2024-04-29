<h1>MAP STUFF</h1>
<p> trying to figure out this map stuff </p>
<h1>test</h1>

<script>
    import { onMount } from 'svelte';
    import mapboxgl from 'mapbox-gl';

    let map;
    let hoveredZipCode = null;
    let clickedZipCode = null; 
    let popup;

    let my_lng = -71.104518; 
    let my_lat = 42.3483995;
    let my_zoom = 10;
    
    let highlight_color = '#ff0000';
    let outline_color = '#39457d';

    
    onMount(() => {
        
        const initState = { lng: my_lng, lat: my_lat, zoom: my_zoom };

        mapboxgl.accessToken = 'pk.eyJ1IjoicmFiZW5vcyIsImEiOiJjbHZjanN4ZG8wa2dqMmxsajF1NTZ1YnJlIn0.xEeCpaz398GFW5biDtwYqA';
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [initState.lng, initState.lat],
            zoom: initState.zoom
        });

        map.on('load', () => {
            map.addSource('zipcodes', {
                type: 'geojson',
                data: 'https://raw.githubusercontent.com/rabenold/MASS_MAPC_GEOJSON/main/filtered_geojson_file.geojson'
                
                //data:'https://raw.githubusercontent.com/nblmc/massachusetts-municipal-boundaries/main/data-cooked/mass-municipalities.geojson'
                //data: 'https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ma_massachusetts_zip_codes_geo.min.json'
            });

            map.addLayer({
                id: 'zipcodes-layer',
                type: 'line',
                source: 'zipcodes',
                layout: {},
                paint: {
                    'line-color': outline_color,
                    'line-width': 2,
                    'line-opacity': 0.5
                }
            });

            map.addLayer({
                id: 'zipcode-fill',
                type: 'fill',
                source: 'zipcodes',
                layout: {},
                paint: {
                    'fill-color': [
                        'case',
                        ['boolean', ['feature-state', 'hover'], false],
                        highlight_color, // Red color when hovered
                        'rgba(0, 0, 0, 0)' // Transparent otherwise
                    ],
                    'fill-opacity': 0.3
                }
            });

            popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });



            // for generating pop up and highlighting 
            map.on('mousemove', 'zipcode-fill', (e) => {
                if (e.features.length > 0) {
                    if (hoveredZipCode !== null) {
                        map.setFeatureState(
                            { source: 'zipcodes', id: hoveredZipCode },
                            { hover: false }
                        );
                    }
//hoveredZipCode = e.features[0].properties['massgis_name'];

                    hoveredZipCode = e.features[0].properties['massgis_name'];
                    //console.log(hoveredZipCode);
                    map.setFeatureState(
                        { source: 'zipcodes', id: hoveredZipCode },
                        { hover: true }
                    );

                    popup.setLngLat(e.lngLat)
                        .setHTML('<h4>' + hoveredZipCode + '</h4>')
                        .addTo(map);
                    map.setPaintProperty(
                        'zipcodes-layer',
                        'line-color',
                        [ 
                            'case',
                        ['==', ['get', 'massgis_name'], hoveredZipCode],
                        highlight_color, // Red color when hovered
                        ['==', ['get', 'massgis_name'], clickedZipCode],
                            highlight_color, // Red color when clicked
                        outline_color // Transparent otherwise
                        ]
                    );

                    map.setPaintProperty(
                        'zipcodes-layer',
                        'line-opacity',
                        [
                            'case',
                            ['==', ['get', 'massgis_name'], hoveredZipCode],
                            1, // Red color when hovered
                            ['==', ['get', 'massgis_name'], clickedZipCode],
                            1,
                            .2  // Default color
                        ]
                    );
                    map.setPaintProperty(
                        'zipcodes-layer',
                        'line-width',
                        [
                            'case',
                            ['==', ['get', 'massgis_name'], hoveredZipCode],
                            3, // Red color when hovered
                            ['==', ['get', 'massgis_name'], clickedZipCode],
                            3,
                            2  // Default color
                        ]

                    );
                }
            });

            map.on('mouseleave', 'zipcodes-layer', () => {
                if (hoveredZipCode !== null) {
                    map.setFeatureState(
                        { source: 'zipcodes', id: hoveredZipCode },
                        { hover: false }
                    );
                }
                popup.remove();
            });

            map.on('mousemove', 'zipcode-fill', (e) => {
                if (e.features.length > 0) {
                    if (hoveredZipCode !== null) {
                        map.setFeatureState(
                            { source: 'zipcodes', id: hoveredZipCode },
                            { hover: false }
                        );
                    }
                    hoveredZipCode = e.features[0].properties['massgis_name'];
                   

                    popup.setLngLat(e.lngLat)
                        .setHTML('<h3>' + hoveredZipCode + '</h3>')
                        .addTo(map);  
                }
            }); 
    
    
    
    map.on('click', 'zipcode-fill', (e) => {
        clickedZipCode = e.features[0].properties['massgis_name'];
        console.log(e.features[0]);
        document.getElementById("hovered_zip_code").innerHTML = clickedZipCode; 


    // Get the clicked feature


    // Get the centroid of the polygon geometry
    const centroid = getPolygonCentroid(e.features[0].geometry.coordinates[0]);

    // Fly to the centroid of the polygon
    map.flyTo({ center: centroid, zoom: 10.5});
});

// Function to calculate the centroid of a polygon
function getPolygonCentroid(coordinates) {
    let centerX = 0;
    let centerY = 0;

    // Calculate the centroid
    for (let i = 0; i < coordinates.length; i++) {
        centerX += coordinates[i][0];
        centerY += coordinates[i][1];
    }

    centerX /= coordinates.length;
    centerY /= coordinates.length;

    return [centerX, centerY];
}

            //zoom on click
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    map.flyTo({
                        center: [initState.lng, initState.lat],
                        zoom: initState.zoom
                    });
                }
            });
        });
    });


    function calculateZoomLevel(width, height) {
    // You can define your own logic to calculate the zoom level here
    // For example, you could base it on the aspect ratio of the viewport or any other criteria
    // This is just a placeholder example
    const aspectRatio = width / height;
    if (aspectRatio < 1) {
        return 8; // Example zoom level for portrait orientation
    } else {
        return 10; // Example zoom level for landscape orientation
    }
}

</script>

<style>
    @import url("$lib/global.css");
</style>

<div class="map_container" style="background-color: grey; float: right; width: 100vw; height: 100vw; ">
    <div id="map"></div>
    <div id="hovered_zip_code" ></div>
</div> 