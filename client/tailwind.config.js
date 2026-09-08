/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiggy: {
          orange: '#FC8019',
          orangeHover: '#e06f12',
          black: '#282C3F',
          gray: '#686B78',
          lightGray: '#F2F2F2',
          green: '#48C479',
          border: '#D4D5D9'
        }
      }
    },
  },
  plugins: [],
}

