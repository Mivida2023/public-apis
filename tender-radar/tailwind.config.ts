import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef7ff",
          100: "#d9edff",
          500: "#1d6fd8",
          600: "#1558b0",
          700: "#114689",
          900: "#0c2f5a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
