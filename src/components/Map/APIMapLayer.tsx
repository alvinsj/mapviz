import { useEffect, useMemo } from 'react'
import { Source, Layer } from 'react-map-gl'
import { useContextSelector } from 'use-context-selector'

import context from '../../context'
import { useThemeContext } from '../../contexts/ThemeContext'
import useHoverFeature from '../../hooks/useHoverFeature'
import { useFeatureFlagContext } from '../../contexts/FeatureFlagContext'
import { SHOW_REGIONS } from '../../config/featureFlags'
import { MapPluginComponentProps } from '../types'

import {
  continuosPointLayerStyle,
  highlightPointLayerStyle,
} from './layerStyles'

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

  if (!apiLayerData) return <div />

  return (
    <Source type="geojson" data={apiLayerData}>
      <Layer
        id="api-points"
        {...continuosPointLayerStyle()}
        filter={['==', '$type', 'Point']}
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
