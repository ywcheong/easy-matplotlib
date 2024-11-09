import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{vue,html,js,ts}", 
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
} satisfies Config