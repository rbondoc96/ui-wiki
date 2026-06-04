import { MoonIcon, SunIcon } from "@phosphor-icons/react"

import { Button } from "#/components/ui/button.tsx"
import { useTheme } from "#/lib/theme.tsx"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      aria-label="Toggle theme"
      onClick={toggleTheme}
      size="icon"
      variant="ghost"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
