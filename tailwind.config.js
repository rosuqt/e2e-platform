/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",  // Scan files in app folder
    "./landing-page/**/*.{js,ts,jsx,tsx}", // Scan landing-page files
    "./src/**/*.{js,ts,jsx,tsx}", // If you have a src folder
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
