/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0052cc",
        accent: "#00bfa6",
        dark: "#0d1117",
        light: "#f4f5f7",
      },
    },
  },
  plugins: [],
};
