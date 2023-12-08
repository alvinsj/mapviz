import { useCallback, useEffect, useMemo } from 'react'
import { Source, Layer } from 'react-map-gl'
import bbox from '@turf/bbox'
import bboxPolygon from '@turf/bbox-polygon'
import { lighten, darken, transparentize } from 'color2k'
import { useMap, LayerProps, MapboxGeoJSONFeature } from 'react-map-gl'
import { Feature, featureCollection } from '@turf/helpers'

import { useThemeContext } from '../../contexts/ThemeContext'

import { useContextSelector } from 'use-context-selector'
import useHoverFeature from '../../hooks/useHoverFeature'
import { useFeatureFlagContext } from '../../contexts/FeatureFlagContext'

import { layerStyle, highlightLayerStyle } from './layerStyles'

import { MapPluginComponentProps } from '../types'
import { Theme } from '../../types'
import { BBOX_ZOOM } from '../../config/featureFlags'
import { useClickFeature } from '../../hooks/useClickFeature'
import context from '../../context'

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
  const mapLayerData = useContextSelector(context, v => (v as any)[0].mapLayerData2)

  // hover layer
  const { feature: hoverLayerFeature } = useHoverFeature(mapId, LAYER_NAME)
  const hoverZoneName = hoverLayerFeature?.properties?.[FEAT_PROPERTY_NAME]
  const filterHighlightLayer = useMemo(
    () => ['in', FEAT_PROPERTY_NAME, hoverZoneName || ''],
    [hoverZoneName]
  )

  useEffect(() => {
    addZBHover()
    return () => removeZBHover()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // only flag change

  /// hover zoombox
  const {
    feature: hoverZoomBoxFeature,
    add: addZBHover,
    remove: removeZBHover,
  } = useHoverFeature(mapId, 'zoomBox', {
    eventType: 'mouseenter',
  })
  const hoverZoomBoxName = hoverZoomBoxFeature?.properties?.id
  const filterZoomBoxLayer = useMemo(
    () => ['in', 'id', hoverZoomBoxName || ''],
    [hoverZoomBoxName]
  )

  const [getValue] = useFeatureFlagContext(),
    flagEnableBboxZoom = getValue(BBOX_ZOOM)

  useEffect(() => {
    if (flagEnableBboxZoom) addZBHover()
    else removeZBHover()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagEnableBboxZoom]) // only flag change

  const zoomBoxData =
    mapLayerData && flagEnableBboxZoom
      ? makeBboxes(mapLayerData as MapboxGeoJSONFeature)
      : undefined

  const { [mapId]: map } = useMap()

  const handleClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ev: any, feature?: MapboxGeoJSONFeature) => {
      if (!zoomBoxData || !flagEnableBboxZoom || !feature) return

      const [minLng, minLat, maxLng, maxLat] = bbox(feature)
      map?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        { padding: 0, duration: 1000 }
      )
    },
    [map, flagEnableBboxZoom, zoomBoxData]
  )
  const { add, remove } = useClickFeature(mapId, 'zoomBox')

  useEffect(() => {
    if (flagEnableBboxZoom) add(handleClick)
    else remove(handleClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flagEnableBboxZoom]) // only when feature is on

  return (
    <>
      {flagEnableBboxZoom && (
        <Source id="zoomBoxSource" type="geojson" data={zoomBoxData}>
          <Layer
            {...layerStyle({
              theme,
              modifyColor: hoverZoomBoxName ? undimColor : dimColor,
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

export const CustomControls = () => {
  const [getValue, replaceFlag] = useFeatureFlagContext()

  const onToggleBox = useCallback(() => {
    const cur = getValue(BBOX_ZOOM)
    replaceFlag(BBOX_ZOOM, !cur)
  }, [getValue, replaceFlag])

  return (
    <button
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
