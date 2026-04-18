/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bank: {
          bg: "#020617",
          card: "#0f172a",
          primary: "#14b8a6",
          "primary-dim": "#0d9488",
          text: "#f8fafc",
          muted: "#94a3b8",
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        lift: "0 20px 40px -12px rgba(20, 184, 166, 0.15)",
      },
    },
  },
  plugins: [],
};
