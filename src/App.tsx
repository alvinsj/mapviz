import { useMemo, useRef } from 'react'
import Map, {
  Source,
  Layer,
  FullscreenControl,
  NavigationControl,
  ScaleControl,
  MapRef,
} from 'react-map-gl'
import maplibreGl from 'maplibre-gl'

import useBaseMap from './hooks/useBaseMap'

import './App.css'
import {
  regionLayerStyle,
  highlightRegionLayerStyle,
  layerStyle,
  highlightLayerStyle,
} from './layerStyles'
import useHoverFeature from './hooks/useHoverFeature'
import ThemeControl from './ThemeControl'
import useMultiPolygonLayer from './hooks/useMultiPolygonLayer'

const VITE_MULTIPOLYGONS_1_URL = import.meta.env.VITE_MULTIPOLYGONS_1_URL

function App() {
  const { mapStyle, mapRegions, onSwitchTheme, theme } = useBaseMap()

  const mapRef = useRef<MapRef>()
  const hoverFeature = useHoverFeature(mapRef, 'regions')
  const hoverRegion = hoverFeature?.properties?.cell_id

  const selectedRegion = hoverRegion || ''
  const filter = useMemo(
    () => ['in', 'cell_id', selectedRegion],
    [selectedRegion]
  )

  const { mapLayer: layer1 } = useMultiPolygonLayer(VITE_MULTIPOLYGONS_1_URL)
  const hoverLayerFeature = useHoverFeature(mapRef, 'layer1')
  const selectedZoneName = hoverLayerFeature?.properties?.zone_name
  const filterHighlightLayer1 = useMemo(
    () => ['in', 'zone_name', selectedZoneName],
    [selectedRegion]
  )

  return (
    <div className="App">
      {mapStyle && (
        <Map
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
          {mapRegions && (
            <Source type="geojson" data={mapRegions}>
              <Layer {...regionLayerStyle({ theme })} id="regions" />
              <Layer
                {...highlightRegionLayerStyle({ theme })}
                source="regions"
                id="region-highlighted"
                filter={filter}
              />
            </Source>
          )}

          {layer1 && (
            <Source type="geojson" data={layer1}>
              <Layer {...layerStyle({ theme })} id="layer1" />
              <Layer
                {...highlightLayerStyle({ theme })}
                source="layer1"
                id="layer1-highlighted"
                filter={filterHighlightLayer1}
              />
            </Source>
          )}

          {/* controls */}
          <FullscreenControl />
          <NavigationControl />
          <ScaleControl />
          <ThemeControl>
            <div
              className="maplibregl-ctrl 
            maplibregl-ctrl-group mapboxgl-ctrl mapboxgl-ctrl-group"
            >
              <button type="button" onClick={() => onSwitchTheme('dark')}>
                Dark
              </button>
              <button type="button" onClick={() => onSwitchTheme('light')}>
                Light
              </button>
            </div>
          </ThemeControl>
        </Map>
      )}
    </div>
  )
}

export default App
