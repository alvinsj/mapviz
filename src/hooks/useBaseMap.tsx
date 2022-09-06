import { useCallback, useEffect } from 'react'
import { useMemoizedState } from './useMemoizedState'
import { fetchTheme, fetchRegions } from '../apis'
import { useThemeContext } from '../contexts/ThemeContext'

export type Theme = 'dark' | 'light'

function useBaseMap() {
  const [theme, setTheme] = useThemeContext()
  const [mapStyle, setMapStyle] = useMemoizedState(
    undefined,
    `mapStyle-${theme}`
  )
  const [mapRegions, setMapRegions] = useMemoizedState(undefined, 'mapRegions')
  const onSwitchTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme)
  }, [])
  useEffect(() => {
    if (mapStyle) return // guard

    fetchTheme(theme)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]) // only theme change

  useEffect(() => {
    if (mapRegions) return // guard

    fetchRegions()
      .then((response) => response.json())
      .then((data) => {
        setMapRegions(data)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // once

  const renderBaseControls = useCallback(() => {
    return (
      <>
        <button
          type="button"
          onClick={() => onSwitchTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>
      </>
    )
  }, [onSwitchTheme, theme])

  return {
    mapStyle,
    mapRegions,
    theme,
    renderBaseControls,
  }
}
export default useBaseMap