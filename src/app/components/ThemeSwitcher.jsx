"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const THEME_KEY = "theme";

const getSavedTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_KEY);

  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "dark";
};

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState(getSavedTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <label
      className="btn btn-ghost btn-circle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={isDark}
        onChange={(event) => setTheme(event.target.checked ? "dark" : "light")}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
        </motion.span>
      </AnimatePresence>
    </label>
  );
};

export default ThemeSwitcher;
