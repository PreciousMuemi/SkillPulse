/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'skillpulse-blue': {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#0070e0',
          600: '#0056b3',
          700: '#003d80',
          800: '#00264d',
          900: '#001a33'
        }
      }
    },
  },
  plugins: [],
}