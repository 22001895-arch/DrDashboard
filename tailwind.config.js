/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        clinical: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        emergency: {
          red: '#ef4444',
          yellow: '#fbbf24',
          green: '#10b981',
        }
      },
      boxShadow: {
        'clinical': '0 1px 3px 0 rgba(139, 92, 246, 0.1), 0 1px 2px 0 rgba(139, 92, 246, 0.06)',
        'red-flag': '0 0 0 3px rgba(239, 68, 68, 0.1), 0 4px 6px -1px rgba(239, 68, 68, 0.2)',
      }
    },
  },
  plugins: [],
}
