import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { lightTheme, darkTheme, type Theme } from '../styles/theme'
import { GlobalStyle } from '../styles/GlobalStyle'

type ThemeMode = 'light' | 'dark'

type ThemeContextValue = {
  mode: ThemeMode
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem('coffy_theme') as ThemeMode | null
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const theme: Theme = mode === 'light' ? lightTheme : darkTheme

  function toggle() {
    setMode(prev => {
      const next = prev === 'light' ? 'dark' : 'light'
      localStorage.setItem('coffy_theme', next)
      return next
    })
  }

  useEffect(() => {
    const api = window.electronAPI
    if (!api) return
    const handler = (mode: ThemeMode) => {
      localStorage.setItem('coffy_theme', mode)
      setMode(mode)
    }
    api.onThemeChange(handler)
    return () => api.offThemeChange(handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <StyledThemeProvider theme={theme}>
        <GlobalStyle />
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
