import Map, { Source, Layer, LineLayer, FullscreenControl } from "react-map-gl"
import maplibreGl from "maplibre-gl"

import useBaseMap from './hooks/useBaseMap'

import "./App.css"

const lineMapLayer = {
  type: "line",
  paint: {
    "line-color": 'white',
    "line-width": 1,
  }
} as LineLayer

function App() {
  const { mapStyle, mapRegions } = useBaseMap()

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
        <FullscreenControl />
      </Map>}
    </div>
  )
}

export default App
