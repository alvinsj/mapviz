import { ComponentType, createContext, memo, useContext, useState } from 'react'
import { Theme } from '../types'

const initialTheme =
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

export type ThemeContextType = [
  Theme,
  React.Dispatch<React.SetStateAction<Theme>>
]

export const ThemeContext = createContext<ThemeContextType>([
  initialTheme,
  () => undefined,
])

export const provideTheme = (Base: ComponentType) =>
  memo(function WithTheme(props) {
    const [theme, setTheme] = useState<Theme>(initialTheme)
    return (
      <ThemeContext.Provider value={[theme, setTheme]}>
        <Base {...props} />
      </ThemeContext.Provider>
    )
  })

export function useThemeContext() {
  return useContext(ThemeContext)
}
