import { useCallback, useMemo, useState } from 'react'
import { useMap, MapboxGeoJSONFeature } from 'react-map-gl'
import { MapLayerEventType } from 'maplibre-gl'
import throttle from 'lodash.throttle'

export type UseHoverFeatureOpts = {
  eventType?: keyof MapLayerEventType
}

export type HoverFeatureHandler = (
  e: any,
  feature?: MapboxGeoJSONFeature
) => void

export const useHoverFeature = (
  mapId: string,
  layerId: string,
  opts: UseHoverFeatureOpts = { eventType: 'mousemove' }
) => {
  const [feature, setFeature] = useState<MapboxGeoJSONFeature>()
  const { [mapId]: map } = useMap()

  const handleMouseMove = useCallback(
    (cb?: HoverFeatureHandler) =>
      throttle((ev) => {
        const features = map?.queryRenderedFeatures(ev.point, {
          layers: [layerId],
        })

        if (features instanceof Array && features.length > 0) {
          setFeature(features[0])

          // FIXME wrong return type queryRenderedFeatures
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
        } else if (typeof features === 'object') setFeature(features)

        if (cb) cb(ev, feature)
      }, 100),
    [feature, layerId, map]
  )

  const handleMouseLeave = useCallback(() => setFeature(undefined), [])

  const add = useCallback(
    (cb?: (ev: any) => void) => {
      map?.on(
        opts?.eventType as keyof MapLayerEventType,
        layerId,
        handleMouseMove(cb)
      )
      map?.on('mouseleave', layerId, handleMouseLeave)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map]
  )

  const remove = useCallback(
    (cb?: (ev: any) => void) => {
      map?.off(
        opts?.eventType as keyof MapLayerEventType,
        layerId,
        handleMouseMove(cb)
      )
      map?.on('mouseleave', layerId, () => handleMouseLeave)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map]
  )

  return useMemo(() => ({ feature, add, remove }), [feature, add, remove])
}

export default useHoverFeature
