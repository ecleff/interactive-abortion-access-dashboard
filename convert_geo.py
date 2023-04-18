import pandas as pd
import geopandas as gpd
import json
import fiona

print(fiona.supported_drivers)

# Load CSV file into a Pandas DataFrame
df = pd.read_csv('usa_counties_map_to_conv.csv')

# Convert DataFrame to a GeoDataFrame
gdf = gpd.GeoDataFrame(
    df, geometry=gpd.points_from_xy(df.long, df.lat))

# Convert GeoDataFrame to GeoJSON
geojson = json.loads(gdf.to_json())

# Convert GeoJSON to TopoJSON
topojson = gpd.read_file(json.dumps(geojson), driver='GeoJSON')

topojson.to_file('my_file.topojson', driver="GeoJSON") 


# topojson.to_file('output.topojson', driver='TopoJSON')
print(topojson)

