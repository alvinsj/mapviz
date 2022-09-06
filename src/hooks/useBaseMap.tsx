import { useCallback, useEffect, useState } from 'react'

import { useMemoizedState } from './useMemoizedState'
import { fetchTheme } from '../apis'
import { useThemeContext } from '../contexts/ThemeContext'

export type Theme = 'dark' | 'light'

function useBaseMap() {
  const [theme, setTheme] = useThemeContext()
  const [mapStyle, setMapStyle] = useMemoizedState(
    undefined,
    `mapStyle-${theme}`
  )
  const [error, setError] = useState()

  const onSwitchTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme)
    },
    [setTheme]
  )
  useEffect(() => {
    fetchTheme(theme)
      .then((response) => response.json())
      .then((data) => {
        if (data.version && data.layers) {
          setMapStyle({
            ...data,
            center: [1.367786, 103.823583],
            zoom: 5.0,
            bearing: 0,
            pitch: 0,
          })
          setError(undefined)
        } else throw new Error('style.json is invalid')
      })
      .catch((e) => setError(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]) // only theme change

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
    theme,
    renderBaseControls,
    error,
  }
}
export default useBaseMap
