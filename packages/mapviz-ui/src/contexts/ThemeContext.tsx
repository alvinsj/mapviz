import {
  ComponentType,
  createContext,
  memo,
  useContext,
  useMemo,
  useState,
} from 'react'
import { Theme } from '../types'

// FIXME dark theme for now
// const initialTheme = window?.matchMedia?.('(prefers-color-scheme: dark)')
//   .matches
//   ? 'dark'
//   : 'light'

const initialTheme = 'dark'

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

    const context = useMemo<
      [Theme, React.Dispatch<React.SetStateAction<Theme>>]
    >(() => [theme, setTheme], [theme, setTheme])

    return (
      <ThemeContext.Provider value={context}>
        <Base {...props} />
      </ThemeContext.Provider>
    )
  })

export function useThemeContext() {
  return useContext(ThemeContext)
}
