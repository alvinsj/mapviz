import { useEffect } from 'react'
import { useMemoizedState } from './useMemoizedState'
import { MapboxGeoJSONFeature } from 'react-map-gl'

function useMultiPolygonLayer(layerUrl: string): {
  mapLayerData: MapboxGeoJSONFeature | undefined
} {
  const [mapLayerData, setMapLayerData] = useMemoizedState(undefined, layerUrl)
  const [error, setError] = useState()

  useEffect(() => {
    if (mapLayerData) return // guard

    const token = localStorage.getItem('token')?.toString()

    const authHeaders = new Headers()
    authHeaders.append('Accept', 'application/vnd.geo+json')
    if (token) authHeaders.append('Authorization', `Bearer ${token}`)

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
  }, []) // once

  return {
    mapLayerData,
    error,
  }
}
export default useMultiPolygonLayer
