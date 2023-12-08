import { useEffect, useState } from 'react'
import { useMemoizedState } from './useMemoizedState'
import { MapboxGeoJSONFeature } from 'react-map-gl'

function useMultiPolygonLayer(layerUrl: string): {
  mapLayerData?: MapboxGeoJSONFeature
  error?: string
  loading: boolean
} {
  const [mapLayerData, setMapLayerData] = useMemoizedState(undefined, layerUrl)
  const [error, setError] = useState()

  useEffect(() => {
    if (mapLayerData || !layerUrl) return // guard

    const authHeaders = new Headers()
    authHeaders.append('Accept', 'application/vnd.geo+json')

    fetch(layerUrl, { headers: authHeaders })
      .then((response) => response.json())
      .then((data) => {
        if (data.type) {
          setMapLayerData(data)
          setError(undefined)
        } else throw new Error('layer is not valid')
      })
      .catch((e) => {
        setError(e.message)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layerUrl]) // only run when layerUrl changes

  return {
    mapLayerData,
    error,
    loading: !mapLayerData,
  }
}
export default useMultiPolygonLayer
