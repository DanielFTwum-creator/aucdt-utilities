import { useEffect } from 'react'
import { useThemeStore } from '@/store/generationStore'
import type { Theme } from '@/types'

const THEMES: { value: Theme; label: string; icon: string }[] = [
  { value: 'dark',          label: 'Dark',         icon: '🌙' },
  { value: 'light',         label: 'Light',        icon: '☀️' },
  { value: 'high-contrast', label: 'High Contrast', icon: '⬛' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore()

  // Apply theme on mount
  useEffect(() => { setTheme(theme) }, [])  // eslint-disable-line

  return (
    <div className="flex gap-1 bg-navy-800 rounded-lg p-1 border border-navy-700">
      {THEMES.map(t => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          title={t.label}
          className={`px-2 py-1 rounded text-xs transition
            ${theme === t.value
              ? 'bg-brand-600 text-white'
              : 'text-gray-500 hover:text-gray-300'}`}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}
