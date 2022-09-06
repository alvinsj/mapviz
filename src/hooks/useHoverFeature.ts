import { useEffect, useState } from 'react'
import { useMap, MapboxGeoJSONFeature } from 'react-map-gl'
import throttle from 'lodash.throttle'

export const useHoverFeature = (
  mapId: string,
  layerName: string
): MapboxGeoJSONFeature | undefined => {
  const [feature, setFeature] = useState<MapboxGeoJSONFeature>()
  const { [mapId]: map } = useMap()

  useEffect(() => {
    if (!map) return

    const handleMouseMove = throttle((e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerName],
      })

      if (features instanceof Array && features.length > 0) {
        setFeature(features[0])

        // FIXME wrong return type queryRenderedFeatures
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
      } else if (typeof features === 'object') setFeature(features)
    }, 100)

    map.on('mouseover', layerName, handleMouseMove)
    map.on('mouseout', layerName, () => setFeature(undefined))
    return () => {
      map.off('mouseover', layerName, handleMouseMove)
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return feature
}

export default useHoverFeature
