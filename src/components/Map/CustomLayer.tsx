import { useCallback, useEffect, useMemo } from 'react'
import { Source, Layer } from 'react-map-gl'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { lighten, darken } from 'color2k'
import { useMap, LayerProps } from 'react-map-gl'

import { useThemeContext } from '../../contexts/ThemeContext'

import useMultiPolygonLayer from '../../hooks/useMultiPolygonLayer'
import useHoverFeature from '../../hooks/useHoverFeature'
import useLayerClickHandler from '../../hooks/useLayerClickHandler'
import { useFeatureFlagContext } from '../../contexts/FeatureFlagContext'

import { layerStyle, highlightLayerStyle } from './layerStyles'
import { UseControlsProps } from './MapMediator'

import { MapPluginComponentProps } from '../types'
import { Theme } from '../../types'
import { BBOX_ZOOM } from '../../config/featureFlags'

const VITE_MULTIPOLYGONS_1_URL = import.meta.env.VITE_MULTIPOLYGONS_1_URL
const LAYER_NAME = 'layer1'

const modifyColorWithTheme = (theme: Theme) => (color: string) =>
  theme === 'dark' ? lighten(color, 0.3) : darken(color, 0.3)

const createLayerLabels = (source: string, labelName: string): LayerProps => ({
  id: 'poi-labels',
  type: 'symbol',
  source,
  layout: {
    'text-field': ['get', labelName],
    'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
    'text-radial-offset': 0.5,
    'text-justify': 'auto',
    'icon-image': ['get', 'icon'],
  },
})

export function CustomLayer({ mapId }: MapPluginComponentProps) {
  const [theme] = useThemeContext()
  const { mapLayer } = useMultiPolygonLayer(VITE_MULTIPOLYGONS_1_URL)
  const hoverLayerFeature = useHoverFeature(mapId, LAYER_NAME)
  const selectedZoneName = hoverLayerFeature?.properties?.zone_name

  const filterHighlightLayer1 = useMemo(
    () => ['in', 'zone_name', selectedZoneName || ''],
    [selectedZoneName]
  )

  const layer1Bbox = bboxPolygon(bbox(mapLayer))

  const [getValue] = useFeatureFlagContext(),
    shouldEnableBboxZoom = getValue(BBOX_ZOOM)

  const { map1 } = useMap()
  const { add, remove } = useLayerClickHandler(
    'map1',
    'layer1Bbox',
    useCallback(() => {
      if (!map1 || shouldEnableBboxZoom) return

      const [minLng, minLat, maxLng, maxLat] = bbox(mapLayer)
      map1.getMap().fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 40, duration: 1000 }
      )
    }, [mapLayer, map1, shouldEnableBboxZoom])
  )

  useEffect(() => {
    if (shouldEnableBboxZoom) add()
    else remove()
  }, [add, remove, shouldEnableBboxZoom])

  return (
    <>
      {shouldEnableBboxZoom && mapLayer && (
        <Source id="layer1BboxSource" type="geojson" data={layer1Bbox}>
          <Layer
            {...layerStyle({
              theme,
              modifyColor: modifyColorWithTheme(theme),
            })}
            id="layer1Bbox"
          />
        </Source>
      )}

      {mapLayer && (
        <Source id="layer1Source" type="geojson" data={mapLayer}>
          <Layer {...layerStyle({ theme })} id={LAYER_NAME} />
          <Layer
            {...highlightLayerStyle({ theme })}
            source={LAYER_NAME}
            id="layer1-highlighted"
            filter={filterHighlightLayer1}
          />
          <Layer {...createLayerLabels(LAYER_NAME, 'zone_name')} />
        </Source>
      )}
    </>
  )
}

CustomLayer.useControls = (mapId: string, props: UseControlsProps) => {
  const [getValue, replaceFlag] = useFeatureFlagContext()

  const onToggleBox = useCallback(() => {
    const cur = getValue(BBOX_ZOOM)
    replaceFlag(BBOX_ZOOM, !cur)
  }, [getValue, replaceFlag])

  return (
    <button {...props} type="button" onClick={() => onToggleBox()}>
      Box
    </button>
  )
}

export default CustomLayer
