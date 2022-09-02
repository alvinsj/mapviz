import React, { useMemo, useRef } from 'react'
import Map, { Source, Layer, FullscreenControl, NavigationControl, ScaleControl, MapRef } from 'react-map-gl'
import maplibreGl from 'maplibre-gl'

import useBaseMap from './hooks/useBaseMap'

import './App.css'
import { regionLayerStyle, highlightRegionLayerStyle } from './layerStyles'
import useHoverFeature from './hooks/useHoverFeature'

function App() {
  const { mapStyle, mapRegions } = useBaseMap()

  const mapRef = useRef<MapRef>()
  const hoverFeature = useHoverFeature(mapRef, 'regions')
  const hoverRegion = hoverFeature?.properties?.cell_id

  const selectedRegion = (hoverRegion) || ''
  const filter = useMemo(() => ['in', 'cell_id', selectedRegion], [selectedRegion])


  return (
    <div className="App">
      {mapStyle && <Map
        ref={mapRef}
        reuseMaps
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
        {mapRegions && <Source type="geojson" data={mapRegions}>
          <Layer {...regionLayerStyle()} id="regions" />
          <Layer {...highlightRegionLayerStyle()} source="regions" id="region-highlighted" filter={filter} />
        </Source>}
        {/* controls */}
        <FullscreenControl />
        <NavigationControl />
        <ScaleControl />
      </Map>}
    </div>
  )
}

export default App
