import { useCallback, useMemo } from 'react'
import { Source, Layer } from 'react-map-gl'

import useMultiPolygonLayer from '../../hooks/useMultiPolygonLayer'
import { useThemeContext } from '../../contexts/ThemeContext'
import useHoverFeature from '../../hooks/useHoverFeature'
import { useFeatureFlagContext } from '../../contexts/FeatureFlagContext'
import { SHOW_REGIONS } from '../../config/featureFlags'
import { UseControlsProps } from './MapPluginMediator'

import { regionLayerStyle, highlightRegionLayerStyle } from './layerStyles'

const MAP_REGIONS_URL = import.meta.env.VITE_MAP_REGIONS_URL

export type MapPluginComponentProps = { mapId: string }
export function RegionLayer({ mapId }: MapPluginComponentProps) {
  const [theme] = useThemeContext()
  const { mapLayer: mapRegions } = useMultiPolygonLayer(MAP_REGIONS_URL)

  const hoverFeature = useHoverFeature(mapId, 'regions')
  const selectedRegion = hoverFeature?.properties?.cell_id || ''
  const filter = useMemo(
    () => ['in', 'cell_id', selectedRegion],
    [selectedRegion]
  )

  const [getValue] = useFeatureFlagContext(),
    shouldShowRegions = getValue(SHOW_REGIONS)

  return (
    <Source type="geojson" data={mapRegions}>
      <Layer
        {...regionLayerStyle({ theme })}
        id="regions"
        layout={{
          // FIXME layer is added before flag is on
          visibility: shouldShowRegions && mapRegions ? 'visible' : 'none',
        }}
      />
      <Layer
        {...highlightRegionLayerStyle({ theme })}
        source="regions"
        id="region-highlighted"
        filter={filter}
        layout={{
          visibility: shouldShowRegions && mapRegions ? 'visible' : 'none',
        }}
      />
    </Source>
  )
}

export const useControls = (mapId: string, props: UseControlsProps) => {
  const [getValue, replaceFlag] = useFeatureFlagContext()

  const onToggleBox = useCallback(() => {
    const cur = getValue(SHOW_REGIONS)
    replaceFlag(SHOW_REGIONS, !cur)
  }, [getValue, replaceFlag])

  return (
    <button {...props} type="button" onClick={() => onToggleBox()}>
      Reg
    </button>
  )
}

export default RegionLayer
