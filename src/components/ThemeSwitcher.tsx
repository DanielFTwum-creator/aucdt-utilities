import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Contrast } from 'lucide-react'
import { useTheme, Theme } from '../contexts/ThemeContext'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  const themes: Array<{ value: Theme; label: string; icon: React.ReactNode; description: string }> = [
    {
      value: 'light',
      label: 'Light',
      icon: <Sun className="w-5 h-5" />,
      description: 'Bright and clear interface'
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <Moon className="w-5 h-5" />,
      description: 'Easy on the eyes in low light'
    },
    {
      value: 'high-contrast',
      label: 'High Contrast',
      icon: <Contrast className="w-5 h-5" />,
      description: 'Maximum accessibility and readability'
    }
  ]

  const currentTheme = themes.find(t => t.value === theme) || themes[0]

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, themeValue: Theme) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleThemeChange(themeValue)
    }
  }

  return (
    <div className="relative" role="region" aria-label="Theme selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 dark:bg-gray-800 dark:hover:bg-gray-700 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 high-contrast:hover:bg-gray-900 text-white high-contrast:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-academic-gold high-contrast:focus:ring-yellow-400"
        aria-label={`Current theme: ${currentTheme.label}. Click to change theme`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentTheme.icon}
        <span className="font-medium">{currentTheme.label}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Dropdown Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 high-contrast:bg-black high-contrast:border-2 high-contrast:border-yellow-400 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20"
              role="menu"
              aria-label="Theme options"
            >
              <div className="p-2">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    onKeyDown={(e) => handleKeyDown(e, themeOption.value)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-academic-blue high-contrast:focus:ring-yellow-400 ${
                      theme === themeOption.value
                        ? 'bg-academic-blue text-white high-contrast:bg-yellow-400 high-contrast:text-black'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 high-contrast:hover:bg-gray-900 text-gray-900 dark:text-white high-contrast:text-yellow-400'
                    }`}
                    role="menuitemradio"
                    aria-checked={theme === themeOption.value}
                  >
                    <div className="mt-0.5" aria-hidden="true">
                      {themeOption.icon}
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold">{themeOption.label}</div>
                      <div
                        className={`text-sm mt-1 ${
                          theme === themeOption.value
                            ? 'text-white/80 high-contrast:text-black/80'
                            : 'text-gray-600 dark:text-gray-400 high-contrast:text-yellow-300'
                        }`}
                      >
                        {themeOption.description}
                      </div>
                    </div>
                    {theme === themeOption.value && (
                      <div className="mt-1">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 high-contrast:border-yellow-400 p-3 bg-gray-50 dark:bg-gray-900 high-contrast:bg-gray-950">
                <p className="text-xs text-gray-600 dark:text-gray-400 high-contrast:text-yellow-300">
                  <strong>Tip:</strong> High contrast mode improves readability for users with visual impairments
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
