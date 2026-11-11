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
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b8fc',
          400: '#7f93f8',
          500: '#5e6cf2',
          600: '#4649e6',
          700: '#3938cb',
          800: '#3030a4',
          900: '#2c2e82',
          950: '#1b1b4b',
        }
      }
    },
  },
  plugins: [],
}
