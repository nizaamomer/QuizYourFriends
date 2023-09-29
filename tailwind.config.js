/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bgray': '#202026', // Green color
      },
    },
    fontFamily: {
      ckb: ['KurdishFont','sans-serif'],
      en: ['Nunito', 'sans-serif'],
      // Define other fonts as needed
    },
  },

  plugins: [],
}