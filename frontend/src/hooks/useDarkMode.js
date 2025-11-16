import { useEffect, useState } from "react";

export default function useDarkMode() {
  // 🧠 Check system preference first if no saved theme
  const getDefaultTheme = () => {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getDefaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // 🪄 Add smooth fade transition
    root.classList.add("transition-colors", "duration-500");

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔄 Auto-update if system theme changes (optional)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const systemChangeHandler = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mq.addEventListener("change", systemChangeHandler);
    return () => mq.removeEventListener("change", systemChangeHandler);
  }, []);

  // 🌙 Toggle button function
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return [theme, toggleTheme];
}
