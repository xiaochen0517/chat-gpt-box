/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      margin: {
        "21": "5.25rem",
        "22": "5.5rem",
        "23": "5.75rem",
      },
      lineHeight: {
        "11": "2.75rem", // 你可以根据需要设置具体的数值
        "12": "3rem",
        "13": "3.25rem",
        "14": "3.5rem",
        "15": "3.75rem",
        "16": "4rem",
      },
      rotate: {
        "90": "90deg",
      },
      maxWidth: {
        "8xl": "1920px",
        "9xl": "2560px",

        /* content */
        "content": "96rem",
      },
      screens: {
        "content": "96rem",
        "mobile": "76rem",
        "total": "116rem",
      }
    },
    screens: {
      "3xl": "1600px",
    }
  },
  plugins: [],
};
