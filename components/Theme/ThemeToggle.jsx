"use client"

import React from 'react'
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme("light");
  const [mounted, setMounted] = useState(false);

  // To prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full border bg-gray-200 dark:bg-gray-800"
    >
      {theme === "dark" ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
    </button>
  )
}

export default ThemeToggle

