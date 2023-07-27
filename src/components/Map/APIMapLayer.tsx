import { useEffect, useMemo } from 'react'
import { Source, Layer, MapboxGeoJSONFeature } from 'react-map-gl'
import { useContextSelector } from 'use-context-selector'

import context from '../../context'
import { useThemeContext } from '../../contexts/ThemeContext'
import useHoverFeature from '../../hooks/useHoverFeature'
import { useFeatureFlagContext } from '../../contexts/FeatureFlagContext'
import { SHOW_REGIONS } from '../../config/featureFlags'
import { MapPluginComponentProps } from '../types'

import isEqual from 'lodash/isEqual'

import {
  continuosPointLayerStyle,
  continuosLineLayerStyle,
  highlightPointLayerStyle,
} from './layerStyles'
import { Feature, GeoJSONFeature, MapGeoJSONFeature } from 'maplibre-gl'

const FEAT_PROPERTY_ID = 'FEAT_ID'

export function APIMapLayer({ mapId }: MapPluginComponentProps) {
  const [theme] = useThemeContext()
  const apiLayerData = useContextSelector(
    context,
    (v) => (v as any)[0].apiLayerData
  )
  const {
    feature: hoverFeature,
    add,
    remove,
  } = useHoverFeature(mapId, 'regions')

  const hoverFeatureId = hoverFeature?.properties?.[FEAT_PROPERTY_ID] || ''
  const filter = useMemo(
    () => ['in', FEAT_PROPERTY_ID, hoverFeatureId],
    [hoverFeatureId]
  )

  const [getValue] = useFeatureFlagContext(),
    flagShowRegions = getValue(SHOW_REGIONS)

  useEffect(() => {
    if (flagShowRegions) add()
    else remove()
  }, [add, flagShowRegions, remove])

  // merge point feature with similar attribute to line feature
  const mergedData = useMemo(() => {
    if (!apiLayerData) return undefined

    const merged = apiLayerData.features.reduce((acc: any, cur: any) => {
      const { properties, geometry } = cur
      const { coordinates } = geometry as any
      const { callsign: key } = properties as any
      if (acc[key]) {
        if (acc[key].properties.isFirst) {
          if (isEqual(acc[key].geometry.coordinates, coordinates)) return acc

          acc[key].geometry.type = 'LineString'

          acc[key].geometry.coordinates = [acc[key].geometry.coordinates]
          acc[key].properties.isFirst = false
          delete acc[key].properties.isFirst
        }

        acc[key].geometry.coordinates.push(coordinates)
      } else {
        acc[key] = {
          ...cur,
          geometry: {
            ...geometry,
          },
          properties: {
            ...properties,
            isFirst: true,
          },
        }
      }
      return acc
    }, {} as any)

    return { type: 'FeatureCollection', features: Object.values(merged) }
  }, [apiLayerData])

  if (!apiLayerData) return <div />

  return (
    <Source type="geojson" data={{ ...(mergedData as any) }}>
      <Layer
        id="api-points"
        {...(continuosPointLayerStyle() as any)}
        filter={['==', '$type', 'Point']}
      />
      <Layer
        id="api-line-strings"
        {...(continuosLineLayerStyle() as any)}
        filter={['==', '$type', 'LineString']}
      />
      <Layer
        {...highlightPointLayerStyle({ theme })}
        filter={filter}
        source="api-points"
        id="api-points-highlight"
      />
    </Source>
  )
}

export const CustomControls = () => {
  return <div />
}

export default APIMapLayer
