import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        mono: ["var(--font-space-mono)", "monospace"],
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "600": "600ms",
        "800": "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
