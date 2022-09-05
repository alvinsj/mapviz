import { useEffect } from 'react'
import { useMemoizedState } from './useMemoizedState'

function useMultiPolygonLayer(layerUrl: string) {
  const [mapLayer, setMapLayer] = useMemoizedState(undefined, layerUrl)

  useEffect(() => {
    if (mapLayer) return // guard

    const token = localStorage.getItem('token')?.toString()

    const authHeaders = new Headers()
    authHeaders.append('Accept', 'application/vnd.geo+json')
    if (token) authHeaders.append('Authorization', `Bearer ${token}`)

    fetch(layerUrl, { headers: authHeaders })
      .then((response) => response.json())
      .then((data) => {
        setMapLayer(data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // once

  return {
    mapLayer,
  }
}
export default useMultiPolygonLayer
