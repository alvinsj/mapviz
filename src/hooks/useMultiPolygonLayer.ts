import { useEffect } from 'react'
import { useMemoizedState } from './useMemoizedState'
import { MapboxGeoJSONFeature } from 'react-map-gl'

function useMultiPolygonLayer(layerUrl: string): {
  mapLayerData: MapboxGeoJSONFeature | undefined
} {
  const [mapLayerData, setMapLayerData] = useMemoizedState(undefined, layerUrl)

  useEffect(() => {
    if (mapLayerData) return // guard

    const token = localStorage.getItem('token')?.toString()

    const authHeaders = new Headers()
    authHeaders.append('Accept', 'application/vnd.geo+json')
    if (token) authHeaders.append('Authorization', `Bearer ${token}`)

    fetch(layerUrl, { headers: authHeaders })
      .then((response) => response.json())
      .then((data) => {
        setMapLayerData(data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // once

  return {
    mapLayerData,
  }
}
export default useMultiPolygonLayer
