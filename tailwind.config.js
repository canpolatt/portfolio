/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'], 
      },
      maxWidth: {
        'custom': '768px',
      },
      padding: {
        '5': '20px', 
      },
      // TODO: make this configurable
      // backgroundColor:{
      //   'dark': '#1d1e20',
      //   'light': '#ffffff',
      // }
    },
  },
}