import { useEffect, useState } from "react";
import Map, { Source, Layer, LineLayer, } from "react-map-gl";

import "./App.css";
import maplibreGl from "maplibre-gl";

const MAP_STYLE_URL = import.meta.env.VITE_MAP_STYLE_URL
const MAP_REGIONS_URL = import.meta.env.VITE_MAP_REGIONS_URL

const lineMapLayer = {
  type: "line",
  paint: {
    "line-color": 'white',
    "line-width": 1,
  }
} as LineLayer;

function App() {
  const [mapStyle, setMapStyle] = useState();
  const [mapRegions, setMapRegions] = useState();

  useEffect(() => {
    fetch(MAP_STYLE_URL)
      .then((response) => response.json())
      .then((data) => {
        setMapStyle({
          ...data,
          center: [1.367786, 103.823583],
          zoom: 5.0,
          bearing: 0,
          pitch: 0
        })
      })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')?.toString()

    const authHeaders = new Headers();
    authHeaders.append('Accept', 'application/vnd.geo+json')
    if (token) authHeaders.append('Authorization', `Bearer ${token}`);

    fetch(MAP_REGIONS_URL, { headers: authHeaders })
      .then((response) => response.json())
      .then((data) => {
        setMapRegions(data)
      })
  }, [])

  console.log(mapRegions)

  return (
    <div className="App">
      {mapStyle && <Map
        initialViewState={{
          longitude: 103.82358,
          latitude: 1.367786,
          zoom: 10,
        }}
        style={{ width: '90vw', height: '90vh' }}
        mapStyle={mapStyle}
        mapLib={maplibreGl}
        attributionControl={false}
        maxBounds={[103.58, 1.16, 104.1, 1.5]}
      >
        {mapRegions && <Source id="regions" type="geojson" data={mapRegions}>
          <Layer {...lineMapLayer}></Layer>
        </Source>}
      </Map>}
    </div>
  );
}

export default App;
