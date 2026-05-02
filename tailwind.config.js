/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F5',
        card: '#FFFFFF',
        paypay: '#FF0033',
        amount: '#111111',
        done: '#AAAAAA',
        'swipe-complete': '#4CAF50',
      },
    },
  },
  plugins: [],
}
