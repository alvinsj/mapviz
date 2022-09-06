/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useMemo, useState } from 'react'
import { useMap, MapboxGeoJSONFeature } from 'react-map-gl'
import throttle from 'lodash.throttle'

export type ClickFeatureHandler = (
  e: any,
  feature?: MapboxGeoJSONFeature
) => void

export function useClickFeature(mapId: string, layerId: string) {
  const { [mapId]: map } = useMap()
  const [feature, setFeature] = useState<MapboxGeoJSONFeature>()

  const handleClick = useMemo(
    () => (cb: ClickFeatureHandler) =>
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

        if (cb) cb(ev, features?.[0])
      }, 100),
    [layerId, map]
  )

  const add = useCallback(
    (cb: (ev: any) => void) => map?.on('click', layerId, handleClick(cb)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map]
  )

  const remove = useCallback(
    (cb: (ev: any) => void) => map?.off('click', layerId, handleClick(cb)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [map]
  )

  return useMemo(
    () => ({
      feature,
      add,
      remove,
    }),
    [feature, add, remove]
  )
}

export default useClickFeature
