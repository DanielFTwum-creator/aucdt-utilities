import { Sun, Moon, Contrast } from 'lucide-react'
import { useTheme, Theme } from '../contexts/ThemeContext'

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes: { value: Theme; label: string; icon: React.ReactElement }[] = [
    { value: 'light', label: 'Light', icon: <Sun className="w-4 h-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="w-4 h-4" /> },
    { value: 'high-contrast', label: 'High Contrast', icon: <Contrast className="w-4 h-4" /> }
  ]

  return (
    <div
      className="flex gap-2 p-1 bg-gray-200 dark:bg-gray-700 rounded-lg"
      role="group"
      aria-label="Theme selector"
    >
      {themes.map(({ value, label, icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md transition-all
            focus:outline-none focus:ring-2 focus:ring-academic-blue focus:ring-offset-2
            ${theme === value
              ? 'bg-white dark:bg-gray-800 shadow-sm text-academic-navy dark:text-white'
              : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50'
            }
          `}
          aria-label={`Switch to ${label} theme`}
          aria-pressed={theme === value}
        >
          {icon}
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  )
}
