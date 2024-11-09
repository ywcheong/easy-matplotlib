/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{vue,html,js}", 
    "./index.html"
  ],
  theme: {
    extend: {
      colors:{
        'theme-purple': '#440154',
        'theme-navy': '#3b528b',
        'theme-teal': '#21918c',
        'theme-lime': '#5ec962',
        'theme-yellow': '#fde725',
      }
    },
  },
  plugins: [],
}

