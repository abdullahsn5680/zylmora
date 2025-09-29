/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './Components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      screens: {
  
        'xxs': { 'max': '350px' },
   
      },
    },
  },
  plugins: [],
}
