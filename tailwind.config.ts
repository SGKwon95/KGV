import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // KGV 브랜드 컬러 (CGV 레드 계열 벤치마킹)
        kgv: {
          red: "#E42525",
          "red-dark": "#C41E1E",
          "red-light": "#FF4444",
          dark: "#1A1A1A",
          gray: "#2D2D2D",
          "gray-light": "#F5F5F5",
          gold: "#FFD700",
        },
      },
      fontFamily: {
        sans: ["Pretendard", "Apple SD Gothic Neo", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
