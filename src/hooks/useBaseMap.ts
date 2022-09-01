import {useEffect, useState} from 'react'

const MAP_STYLE_URL = import.meta.env.VITE_MAP_STYLE_URL
const MAP_REGIONS_URL = import.meta.env.VITE_MAP_REGIONS_URL

function useData () {
  const [mapStyle, setMapStyle] = useState()
  const [mapRegions, setMapRegions] = useState()

  useEffect(() => {
    fetch(MAP_STYLE_URL)
      .then((response) => response.json())
      .then((data) => {
        setMapStyle({
          ...data,
          center: [1.367786, 103.823583],
          zoom: 5.0,
          bearing: 0,
          pitch: 0
        })
      })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')?.toString()

    const authHeaders = new Headers()
    authHeaders.append('Accept', 'application/vnd.geo+json')
    if (token) authHeaders.append('Authorization', `Bearer ${token}`)

    fetch(MAP_REGIONS_URL, { headers: authHeaders })
      .then((response) => response.json())
      .then((data) => {
        setMapRegions(data)
      })
  }, [])

  return {
    mapStyle,
    mapRegions
  }
}
export default useData