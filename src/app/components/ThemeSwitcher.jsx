"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

const ThemeSwitcher = () => {
  const [isDark, setIsDark] = useState(false);

  return (
    <label
      className="btn btn-ghost btn-circle"
      aria-label="Toggle light and dark theme"
    >
      <input
        type="checkbox"
        className="theme-controller sr-only"
        value="dark"
        checked={isDark}
        onChange={(event) => setIsDark(event.target.checked)}
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
