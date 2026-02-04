/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poe: {
          bg: '#0f0f0f',         // Very dark grey/black
          panel: '#1a1a1a',      // Dark panel
          border: '#333333',     // Subtle border
          accent: '#eebb99',     // POE gold/beige
          red: '#d13a3a',
          green: '#5cb85c',
        }
      }
    },
  },
  plugins: [],
}

