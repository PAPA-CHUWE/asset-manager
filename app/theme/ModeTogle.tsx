'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'

export function ModeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentTheme = theme === 'system' ? systemTheme : theme

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative"
    >
      <Sun
        className={`h-[1.2rem] w-[1.2rem] transition-all absolute ${
          currentTheme === 'dark'
            ? 'scale-0 -rotate-90'
            : 'scale-100 rotate-0'
        }`}
      />
      <Moon
        className={`h-[1.2rem] w-[1.2rem] transition-all absolute ${
          currentTheme === 'dark'
            ? 'scale-100 rotate-0'
            : 'scale-0 rotate-90'
        }`}
      />
    </Button>
  )
}
