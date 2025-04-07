/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./landing-page/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        button: "#3B82F6",
        buttonHover: "#2563EB",
        customYellow: "#E8AF30",
        darkBlue: "#162F65",
        customPurple: "#5651AB",
      },
    },
  },
  plugins: [],
};
