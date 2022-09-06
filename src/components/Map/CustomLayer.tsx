import { useCallback, useEffect, useMemo } from 'react'
import { Source, Layer } from 'react-map-gl'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { lighten, darken, transparentize } from 'color2k'
import { useMap, LayerProps, MapboxGeoJSONFeature } from 'react-map-gl'
import { Feature, featureCollection } from '@turf/helpers'

import { useThemeContext } from '../../contexts/ThemeContext'

import useMultiPolygonLayer from '../../hooks/useMultiPolygonLayer'
import useHoverFeature from '../../hooks/useHoverFeature'
import useLayerClickHandler from '../../hooks/useLayerClickHandler'
import { useFeatureFlagContext } from '../../contexts/FeatureFlagContext'

import { layerStyle, highlightLayerStyle } from './layerStyles'
import { useCustomControlsProps } from './MapPluginMediator'

import { MapPluginComponentProps } from '../types'
import { Theme } from '../../types'
import { BBOX_ZOOM } from '../../config/featureFlags'

const VITE_MULTIPOLYGONS_1_URL = import.meta.env.VITE_MULTIPOLYGONS_1_URL
const LAYER_NAME = 'layer2'
const FEAT_PROPERTY_NAME = 'Unique ID'

const dimColor = (color: string) => transparentize(color, 1)
const undimColor = (color: string) => transparentize(color, 0)

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

const makeBboxes = (feats: MapboxGeoJSONFeature & { features?: Feature[] }) => {
  if (!feats || !feats.features) return

  const boxes = feats.features.map((f: Feature, index: number) => {
    return bboxPolygon(bbox(f), { properties: { id: index } })
  })

  return featureCollection(boxes)
}

export function CustomLayer({ mapId }: MapPluginComponentProps) {
  const [theme] = useThemeContext()
  const { mapLayerData } = useMultiPolygonLayer(VITE_MULTIPOLYGONS_1_URL)

  // hover layer
  const hoverLayerFeature = useHoverFeature(mapId, LAYER_NAME)
  const selectedZoneName = hoverLayerFeature?.properties?.[FEAT_PROPERTY_NAME]
  const filterHighlightLayer = useMemo(
    () => ['in', FEAT_PROPERTY_NAME, selectedZoneName || ''],
    [selectedZoneName]
  )

  /// hover zoombox
  const hoverZoomBoxFeature = useHoverFeature(mapId, 'zoomBox', {
    eventType: 'mouseenter',
  })
  const selectedZoomBoxName = hoverZoomBoxFeature?.properties?.id
  const filterZoomBoxLayer = useMemo(
    () => ['in', 'id', selectedZoneName || ''],
    [selectedZoomBoxName]
  )

  const zoomBoxData =
    mapLayerData && makeBboxes(mapLayerData as MapboxGeoJSONFeature)

  const [getValue] = useFeatureFlagContext(),
    shouldEnableBboxZoom = getValue(BBOX_ZOOM)

  const { [mapId]: map } = useMap()
  const { add, remove } = useLayerClickHandler(
    mapId,
    'zoomBox',
    useCallback(
      (ev) => {
        if (!zoomBoxData || !shouldEnableBboxZoom || !ev.features) return

        const [minLng, minLat, maxLng, maxLat] = bbox(ev.features[0])
        map?.fitBounds(
          [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          { padding: 0, duration: 1000 }
        )
      },
      [map, mapLayerData, shouldEnableBboxZoom]
    )
  )

  useEffect(() => {
    if (shouldEnableBboxZoom) add()
    else remove()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldEnableBboxZoom]) // only when feature is on

  return (
    <>
      {shouldEnableBboxZoom && zoomBoxData && (
        <Source id="zoomBoxSource" type="geojson" data={zoomBoxData}>
          <Layer
            {...layerStyle({
              theme,
              modifyColor: selectedZoomBoxName ? undimColor : dimColor,
            })}
            id="zoomBox"
          />
          <Layer
            {...layerStyle({
              theme,
              modifyColor: modifyColorWithTheme(theme),
            })}
            source="zoomBox"
            id="zoomBox-highlighted"
            filter={filterZoomBoxLayer}
          />
        </Source>
      )}

      {mapLayerData && (
        <Source id="layer1Source" type="geojson" data={mapLayerData}>
          <Layer {...layerStyle({ theme })} id={LAYER_NAME} />
          <Layer
            {...highlightLayerStyle({ theme })}
            source={LAYER_NAME}
            id={`${LAYER_NAME}-highlighted`}
            filter={filterHighlightLayer}
          />
          <Layer {...createLayerLabels(LAYER_NAME, 'zone_name')} />
        </Source>
      )}
    </>
  )
}

export const useCustomControls = (
  mapId: string,
  props: useCustomControlsProps
) => {
  const [getValue, replaceFlag] = useFeatureFlagContext()

  const onToggleBox = useCallback(() => {
    const cur = getValue(BBOX_ZOOM)
    replaceFlag(BBOX_ZOOM, !cur)
  }, [getValue, replaceFlag])

  return (
    <button
      {...props}
      style={{
        backgroundColor: getValue(BBOX_ZOOM) ? 'lightcyan' : 'lightgray',
      }}
      type="button"
      onClick={() => onToggleBox()}
    >
      Box
    </button>
  )
}

export default CustomLayer
