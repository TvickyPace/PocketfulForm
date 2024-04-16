/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-black": "#191919",
        "light-dark-black": "#3c3c3c",
        "light-background": "#f0f0f0",
      },
    },
  },
  plugins: [],
};
