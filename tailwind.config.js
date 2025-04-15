/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0891b2",
          50: "#ecfeff",
          100: "#cff9fe",
          200: "#a5f0fc",
          300: "#67e3f9",
          400: "#22ccee",
          500: "#06aed4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        background: "#f8fafc",
        card: "#ffffff",
        text: "#0f172a",
        border: "#e2e8f0",
        muted: "#64748b",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
}