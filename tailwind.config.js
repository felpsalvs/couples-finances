/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3498db", // Azul para elementos principais
        secondary: "#e74c3c", // Vermelho para gastos/alertas
        success: "#2ecc71", // Verde para receitas/sucesso
        warning: "#f39c12", // Laranja para alertas médios
        background: "#f5f5f5", // Fundo principal
        card: "#ffffff", // Fundo de cartões
        "text-primary": "#2c3e50", // Texto principal
        "text-secondary": "#7f8c8d", // Texto secundário
      },
    },
  },
  plugins: [],
};