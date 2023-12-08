# mapviz

This repo tries:
- Map viz with maplibre-gl and custom tile/layer
- Use of mediator/plugin pattern 

<img width="1470" alt="Screenshot 2023-07-11 at 9 09 41 PM" src="https://github.com/alvinsj/mapviz/assets/243186/69371a35-97c2-4937-995c-a497ee07ea30">

### Add environment variables 

For example,
```
VITE_DARK_MAP_STYLE_URL="https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:DarkGray?type=style&token={API_KEY}"
VITE_LIGHT_MAP_STYLE_URL="https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Streets?type=style&token={API_KEY}"

VITE_MAP_REGIONS_URL=/layers/regions.geojson
VITE_MULTIPOLYGONS_1_URL=/layers/sdcp_nature_area.geojson
```
