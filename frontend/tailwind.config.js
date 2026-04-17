/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        duo: {
          green: "#58CC02",
          "green-dark": "#46a302",
          red: "#FF4B4B",
          blue: "#1CB0F6",
          gold: "#FFD700",
          navy: "#1F2937",
          card: "#FFFFFF",
          border: "#E5E7EB",
          bg: "#F7F7F7",
          text: "#3C3C3C",
          muted: "#777777",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
