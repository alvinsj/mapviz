import { Theme } from '../types'

const DARK_MAP_STYLE_URL: string = import.meta.env.VITE_DARK_MAP_STYLE_URL
const LIGHT_MAP_STYLE_URL: string = import.meta.env.VITE_LIGHT_MAP_STYLE_URL
const MAP_REGIONS_URL = import.meta.env.VITE_MAP_REGIONS_URL

const THEME_URLS = {
  dark: DARK_MAP_STYLE_URL,
  light: LIGHT_MAP_STYLE_URL,
}

export const fetchTheme = (theme: Theme) => fetch(THEME_URLS[theme])

export const fetchRegions = () => {
  const token = localStorage.getItem('token')?.toString()

  const authHeaders = new Headers()
  authHeaders.append('Accept', 'application/vnd.geo+json')
  if (token) authHeaders.append('Authorization', `Bearer ${token}`)

  return fetch(MAP_REGIONS_URL, { headers: authHeaders })
}
