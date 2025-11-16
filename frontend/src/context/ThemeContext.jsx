import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {}
});

export function ThemeProvider({ children }) {
  // choose initial theme: localStorage -> system pref -> light
  const getInitial = () => {
    const saved = typeof window !== "undefined" && localStorage.getItem("theme");
    if (saved) return saved;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitial);

  // Apply theme to <html> and persist; add nice transition helper class
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add("transition-colors", "duration-500");
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Listen for system changes (only apply if user hasn't explicitly set theme)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sysHandler = (e) => {
      const saved = localStorage.getItem("theme");
      if (!saved) setTheme(e.matches ? "dark" : "light");
    };
    mq.addEventListener?.("change", sysHandler);
    return () => mq.removeEventListener?.("change", sysHandler);
  }, []);

  // Listen for storage events (sync across tabs/components if needed)
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "theme" && e.newValue) setTheme(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// convenience hook
export function useTheme() {
  return useContext(ThemeContext);
}
