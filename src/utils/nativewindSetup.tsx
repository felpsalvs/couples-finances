import { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void
}

const defaultThemeContext: ThemeContextType = {
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => null
}

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext)

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'system'
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const colorScheme = useColorScheme()

  const resolvedTheme = theme === 'system' ? colorScheme || 'light' : theme

  const value = {
    theme,
    resolvedTheme,
    setTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}