import { createContext, use, useCallback, useEffect, useState } from "react"

type Theme = "dark" | "light"

interface ThemeContextValue {
  setTheme: (theme: Theme) => void
  theme: Theme
  toggleTheme: () => void
}

const STORAGE_KEY = "ui-wiki-theme"

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Inline script injected into the document head so the correct theme class is
 * applied before first paint — avoids a light/dark flash on hydration.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  } catch (e) {}
})();
`

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // The DOM class is already correct (set by themeInitScript); read it back so
  // server render and client agree on a neutral default of "light".
  const [theme, setThemeState] = useState<Theme>("light")

  useEffect(() => {
    setThemeState(
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    )
  }, [])

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore unavailable storage
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(
      document.documentElement.classList.contains("dark") ? "light" : "dark"
    )
  }, [setTheme])

  return (
    <ThemeContext value={{ setTheme, theme, toggleTheme }}>
      {children}
    </ThemeContext>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = use(ThemeContext)
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return ctx
}
