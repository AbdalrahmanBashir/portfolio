/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: '#0284c7',    // A professional blue
        secondary: '#0369a1',  // A darker blue for hover states
        accent: '#f59e0b',     // An accent color for highlighting
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 