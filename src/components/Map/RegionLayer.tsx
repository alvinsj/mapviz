import { useMemo } from 'react'
import { Source, Layer } from 'react-map-gl'

import useMultiPolygonLayer from '../../hooks/useMultiPolygonLayer'
import { useTheme } from '../../contexts/ThemeContext'
import useHoverFeature from '../../hooks/useHoverFeature'
import { regionLayerStyle, highlightRegionLayerStyle } from './layerStyles'

const MAP_REGIONS_URL = import.meta.env.VITE_MAP_REGIONS_URL

export type MapPluginComponentProps = { mapId: string }
export function RegionLayer({ mapId }: MapPluginComponentProps) {
  const [theme] = useTheme()
  const { mapLayer: mapRegions } = useMultiPolygonLayer(MAP_REGIONS_URL)

  const hoverFeature = useHoverFeature(mapId, 'regions')
  const selectedRegion = hoverFeature?.properties?.cell_id || ''
  const filter = useMemo(
    () => ['in', 'cell_id', selectedRegion],
    [selectedRegion]
  )

  return (
    mapRegions && (
      <Source type="geojson" data={mapRegions}>
        <Layer {...regionLayerStyle({ theme })} id="regions" />
        <Layer
          {...highlightRegionLayerStyle({ theme })}
          source="regions"
          id="region-highlighted"
          filter={filter}
        />
      </Source>
    )
  )
}

export default RegionLayer
