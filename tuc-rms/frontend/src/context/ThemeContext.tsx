import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ThemeType = 'light' | 'dark' | 'high-contrast'

interface ThemeContextValue {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  cycleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<ThemeType>('light')

  // Initialize from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('tuc_theme') as ThemeType | null
    const initialTheme = stored || 'light'
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (newTheme: ThemeType) => {
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('tuc_theme', newTheme)
  }

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
    applyTheme(newTheme)
  }

  const cycleTheme = () => {
    const themes: ThemeType[] = ['light', 'dark', 'high-contrast']
    const currentIndex = themes.indexOf(theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
