import { useCallback, useMemo } from 'react'
import Map, {
  Source,
  Layer,
  FullscreenControl,
  NavigationControl,
  ScaleControl,
  LayerProps,
  useMap,
} from 'react-map-gl'
import maplibreGl from 'maplibre-gl'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { lighten, darken } from 'color2k'

import useBaseMap, { Theme } from './hooks/useBaseMap'
import useLayerClickHandler from './hooks/useLayerClickHandler'

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

const createLayerLabels = (source: string, labelName: string): LayerProps => ({
  'id': 'poi-labels',
  'type': 'symbol',
  source,
  'layout': {
    'text-field': ['get', labelName],
    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
    'text-radial-offset': 0.5,
    'text-justify': 'auto',
    'icon-image': ['get', 'icon']
  }
})

const modifyColorWithTheme = (theme: Theme) => (color: string) => theme === 'dark' ? lighten(color, 0.3) : darken(color, 0.3)

function App() {
  const { mapStyle, mapRegions, onSwitchTheme, theme } = useBaseMap()

  const hoverFeature = useHoverFeature('map1', 'regions')
  const selectedRegion = hoverFeature?.properties?.cell_id || ''
  const filter = useMemo(
    () => ['in', 'cell_id', selectedRegion],
    [selectedRegion]
  )

  const { mapLayer: layer1 } = useMultiPolygonLayer(VITE_MULTIPOLYGONS_1_URL)
  const hoverLayerFeature = useHoverFeature('map1', 'layer1')
  const selectedZoneName = hoverLayerFeature?.properties?.zone_name
  const filterHighlightLayer1 = useMemo(
    () => ['in', 'zone_name', selectedZoneName || ''],
    [selectedRegion]
  )

  const layer1Bbox = bboxPolygon(bbox(layer1))

  const { map1 } = useMap()
  useLayerClickHandler('map1', 'layer1Bbox', useCallback(() => {
    if (!map1) return

    const [minLng, minLat, maxLng, maxLat] = bbox(layer1)
    map1.getMap().fitBounds(
      [
        [minLng, minLat],
        [maxLng, maxLat]
      ],
      { padding: 40, duration: 1000 }
    )
  }, [layer1, map1]))


  return (
    <div className="App">
      {mapStyle && (
        <Map
          id="map1"
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
            <Source id="layer1BboxSource" type="geojson" data={layer1Bbox}>
              <Layer {...layerStyle({ theme, modifyColor: modifyColorWithTheme(theme) })} id="layer1Bbox" />
            </Source>
          )}

          {layer1 && (
            <Source id="layer1Source" type="geojson" data={layer1}>
              <Layer {...layerStyle({ theme })} id="layer1" />
              <Layer
                {...highlightLayerStyle({ theme })}
                source="layer1"
                id="layer1-highlighted"
                filter={filterHighlightLayer1}
              />
              <Layer {...createLayerLabels('layer1', 'zone_name')} />
            </Source>
          )}



          {/* controls */}
          <FullscreenControl />
          <NavigationControl />
          <ScaleControl />
          <ThemeControl>
            <div
              className="maplibregl-ctrl maplibregl-ctrl-group 
              mapboxgl-ctrl mapboxgl-ctrl-group"
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
