import { useEffect, useState } from 'react'
import { useMemoizedState } from './useMemoizedState'

function useMultiPolygonLayer(layerUrl) {
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
  }, [])

  return {
    mapLayer,
  }
}
export default useMultiPolygonLayer
