/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ Enable dark mode using the "dark" class
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0052cc",
        accent: "#00bfa6",
        dark: "#0d1117",
        light: "#f4f5f7",
      },
      backgroundImage: {
        // Optional gradient backgrounds for sections
        "gradient-light": "linear-gradient(to bottom right, #e0f2fe, #f9fafb)",
        "gradient-dark": "linear-gradient(to bottom right, #0f172a, #1e293b)",
      },
      boxShadow: {
        "soft-light": "0 4px 20px rgba(0, 0, 0, 0.1)",
        "soft-dark": "0 4px 20px rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [],
};
