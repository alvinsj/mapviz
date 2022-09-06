import { useEffect, useState } from 'react'
import { useMap, MapboxGeoJSONFeature } from 'react-map-gl'
import throttle from 'lodash.throttle'

export const useHoverFeature = (
  mapId: string,
  layerName: string,
  opts?: { eventType: 'mousemove' | 'mouseenter' }
): { feature: MapboxGeoJSONFeature | undefined } => {
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

    // NOTE mousemove works better on fast hover
    const { eventType = 'mousemove' } = opts || {}
    map.on(eventType, layerName, handleMouseMove)
    map.on('mouseleave', layerName, () => setFeature(undefined))
    return () => {
      map.off(eventType, layerName, handleMouseMove)
      return
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return { feature }
}

export default useHoverFeature
