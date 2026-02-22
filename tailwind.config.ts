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
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        // Score colors — only non-stone accents in the palette
        score: {
          good: "#22c55e",    // green-500
          fair: "#eab308",    // yellow-500
          poor: "#ef4444",    // red-500
        },
      },
    },
  },
  plugins: [],
};

export default config;
