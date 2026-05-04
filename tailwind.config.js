/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        curzy: {
          bg: '#0a0a0a',
          accent: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
