/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        megen: {
          green: '#52E360',
          blue: '#0F2437',
        }
      }
    },
  },
  plugins: [],
};