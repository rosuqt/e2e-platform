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
        button: "#5E56E0", 
        customYellow: "#E8AF30",
        darkBlue:"#162F65"
      },
    },
  },
  plugins: [],
};
