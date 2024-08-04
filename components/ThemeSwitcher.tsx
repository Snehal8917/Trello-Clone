"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
    className={`w-fit p-2 m-4 h-full rounded-full hover:scale-105 transition-transform duration-200 bg-blue-500 text-white dark:bg-gray-900`}
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
  >
    {theme === "light" ? "🌞 Dark " : "🌙 Light "}
  </button>
  );
};
