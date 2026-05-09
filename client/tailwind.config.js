/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        trading: {
          up: '#00C087',
          down: '#FF3B30',
          bg: '#0B0E11',
          card: '#1E2329',
          border: '#2B3139',
        }
      }
    },
  },
  plugins: [],
}
