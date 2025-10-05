/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#203a8f", // Deep navy blue
          light: "#3151bd",
          dark: "#15275f",
        },
        secondary: {
          DEFAULT: "#00a86b", // Rich green
          light: "#00cc84",
          dark: "#007a4d",
        },
        accent: {
          DEFAULT: "#d1a520", // Gold
          light: "#f1c234",
          dark: "#a68119",
        },
        background: "#f5f7fa",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(0, 0, 0, 0.08)",
        cardHover: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
    },
  },
  plugins: [],
} 