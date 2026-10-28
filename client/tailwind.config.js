/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#022A68',
          dark: '#060B1A',
          gold: '#D97706',
          light: '#F5F8FC',
          accent: '#2563EB',
          emerald: '#059669'
        }
      }
    },
  },
  plugins: [],
}
