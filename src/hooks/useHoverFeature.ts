import { useEffect, useState, MutableRefObject } from 'react'
import { MapRef, MapboxGeoJSONFeature } from 'react-map-gl'
import throttle from 'lodash.throttle'

export const useHoverFeature = (
  mapRef: MutableRefObject<MapRef | undefined>,
  layerName: string
): MapboxGeoJSONFeature | undefined => {
  const [feature, setFeature] = useState<MapboxGeoJSONFeature>()

  useEffect(() => {
    if (typeof mapRef.current === 'undefined') return

    const map = mapRef.current?.getMap()

    const handleMouseMove = throttle((e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerName],
      })

      if (features instanceof Array && features.length > 0) {
        setFeature(features[0])
      } else if (typeof features === 'object') setFeature(features)
    }, 100)

    map.on('mousemove', handleMouseMove)
    return () => {
      map.off('mousemove', handleMouseMove)
      return
    }
  }, [mapRef])

  return feature
}

export default useHoverFeature
