# mapgl-sg

This repo tries:
- Use of mediator/plugin pattern 

![mapgl-sg](https://user-images.githubusercontent.com/243186/188585641-006eabc2-48ec-4018-9d6f-6a768fc7cf16.gif)

### Add environment variables 

For example,
```
VITE_DARK_MAP_STYLE_URL="https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:DarkGray?type=style&token={API_KEY}"
VITE_LIGHT_MAP_STYLE_URL="https://basemaps-api.arcgis.com/arcgis/rest/services/styles/ArcGIS:Streets?type=style&token={API_KEY}"

VITE_MAP_REGIONS_URL=/layers/regions.geojson
VITE_MULTIPOLYGONS_1_URL=/layers/sdcp_nature_area.geojson
```
