/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      lineHeight: {
        '11': '2.75rem', // 你可以根据需要设置具体的数值
        '12': '3rem',
        '13': '3.25rem',
        '14': '3.5rem',
        '15': '3.75rem',
        '16': '4rem',
      },
    },
    screens: {
      '3xl': '1600px',
    }
  },
  plugins: [],
}
