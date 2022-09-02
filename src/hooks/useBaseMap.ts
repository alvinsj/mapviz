import { useCallback, useEffect, useState } from 'react'

const DARK_MAP_STYLE_URL: string = import.meta.env.VITE_DARK_MAP_STYLE_URL
const LIGHT_MAP_STYLE_URL: string = import.meta.env.VITE_LIGHT_MAP_STYLE_URL

const THEME_URLS = {
  dark: DARK_MAP_STYLE_URL,
  light: LIGHT_MAP_STYLE_URL,
}
export type Theme = 'dark' | 'light'

const MAP_REGIONS_URL = import.meta.env.VITE_MAP_REGIONS_URL

function useData() {
  const [theme, setTheme] = useState<Theme>('light')
  const [mapStyle, setMapStyle] = useState()
  const [mapRegions, setMapRegions] = useState()
  const onSwitchTheme = useCallback((newTheme: Theme = 'dark') => {
    setTheme(newTheme)
  }, [])
  useEffect(() => {
    fetch(THEME_URLS[theme])
      .then((response) => response.json())
      .then((data) => {
        setMapStyle({
          ...data,
          center: [1.367786, 103.823583],
          zoom: 5.0,
          bearing: 0,
          pitch: 0,
        })
      })
  }, [theme])

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
    mapRegions,
    onSwitchTheme,
    theme,
  }
}
export default useData
