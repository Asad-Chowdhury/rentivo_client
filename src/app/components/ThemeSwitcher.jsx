"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const THEME_KEY = "theme";

const isValidTheme = (theme) => {
  return theme === "light" || theme === "dark";
};

const getStoredTheme = () => {
  if (typeof window === "undefined") {
    return "dark";
  }

  const storedTheme = window.localStorage.getItem(THEME_KEY);

  return isValidTheme(storedTheme) ? storedTheme : "dark";
};

const getServerTheme = () => {
  return "dark";
};

const subscribeToTheme = (callback) => {
  const syncTheme = () => {
    document.documentElement.setAttribute("data-theme", getStoredTheme());
    callback();
  };

  syncTheme();
  window.addEventListener("storage", syncTheme);
  window.addEventListener("themechange", syncTheme);

  return () => {
    window.removeEventListener("storage", syncTheme);
    window.removeEventListener("themechange", syncTheme);
  };
};

const setStoredTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(THEME_KEY, theme);
  window.dispatchEvent(new Event("themechange"));
};

const ThemeSwitcher = () => {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    getStoredTheme,
    getServerTheme,
  );
  const isDark = theme === "dark";

  const handleThemeChange = (event) => {
    const nextTheme = event.target.checked ? "dark" : "light";
    setStoredTheme(nextTheme);
  };

  return (
    <label
      className="btn btn-ghost btn-circle"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <input
        type="checkbox"
        className="sr-only"
        checked={isDark}
        onChange={handleThemeChange}
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
