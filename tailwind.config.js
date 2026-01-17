/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hind: ['"Hind Siliguri"', 'sans-serif'], // এই লাইনটি যোগ করুন
      },
    },
  },
  plugins: [],
}