import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // RGB channels (see :root in app/globals.css) so opacity modifiers like bg-gold/60 work
        ivory: "rgb(var(--ivory-rgb) / <alpha-value>)",
        ink: "rgb(var(--ink-rgb) / <alpha-value>)",
        forest: "rgb(var(--forest-rgb) / <alpha-value>)",
        gold: "rgb(var(--gold-rgb) / <alpha-value>)",
        stone: "rgb(var(--stone-rgb) / <alpha-value>)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: { lux: "cubic-bezier(0.22, 1, 0.36, 1)" },
      spacing: { gutter: "clamp(24px, 6vw, 120px)" },
    },
  },
  plugins: [],
};
export default config;
