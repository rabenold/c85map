import geopandas as gpd


cities = ['Acton', 'Arlington', 'Ashland', 'Bedford', 'Bellingham', 'Belmont', 'Beverly', 'Bolton', 'Boston', 'Boxborough', 'Braintree', 'Brookline', 'Burlington', 'Cambridge', 'Canton', 'Carlisle', 'Chelsea', 'Cohasset', 'Concord', 'Danvers', 'Dedham', 'Dover', 'Duxbury', 'Essex', 'Everett', 'Foxborough', 'Framingham', 'Franklin', 'Gloucester', 'Hamilton', 'Hanover', 'Hingham', 'Holbrook', 'Holliston', 'Hopkinton', 'Hudson', 'Hull', 'Ipswich', 'Lexington', 'Lincoln', 'Littleton', 'Lynn', 'Lynnfield', 'Malden', 'Manchester', 'Marblehead', 'Marlborough', 'Marshfield', 'Maynard', 'Medfield', 'Medford', 'Medway', 'Melrose', 'Middleton', 'Milford', 'Millis', 'Milton', 'Nahant', 'Natick', 'Needham', 'Newton', 'Norfolk', 'North Reading', 'Norwell', 'Norwood', 'Peabody', 'Pembroke', 'Quincy', 'Randolph', 'Reading', 'Revere', 'Rockland', 'Rockport', 'Salem', 'Saugus', 'Scituate', 'Sharon', 'Sherborn', 'Somerville', 'Southborough', 'Stoneham', 'Stoughton', 'Stow', 'Sudbury', 'Swampscott', 'Topsfield', 'Wakefield', 'Walpole', 'Waltham', 'Watertown', 'Wayland', 'Wellesley', 'Wenham', 'Weston', 'Westwood', 'Weymouth', 'Wilmington', 'Winchester', 'Winthrop', 'Woburn', 'Wrentham']


cities_to_keep = []

for i in cities: 
    cities_to_keep.append(i.upper() )


geojson_file = "./mass-municipalities.geojson"
gdf = gpd.read_file(geojson_file)

# List of cities you want to keep

# Filter GeoDataFrame based on the 'massgis_name' field
filtered_gdf = gdf[gdf['massgis_name'].isin(cities_to_keep)]

# Save the filtered GeoDataFrame to a new GeoJSON file
filtered_geojson_file = "filtered_geojson_file.geojson"
filtered_gdf.to_file(filtered_geojson_file, driver='GeoJSON')

print("finished")