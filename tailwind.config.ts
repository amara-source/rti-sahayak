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
        ink: "var(--ink)",
        body: "var(--body)",
        grey: "var(--grey)",
        blue: "var(--blue)",
        "blue-dark": "var(--blue-dk)",
        orange: "var(--orange)",
        "icon-background": "var(--icon-bg)",
        line: "var(--line)",
        wash: "var(--wash)",
        green: "var(--green)",
        red: "var(--red)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;
