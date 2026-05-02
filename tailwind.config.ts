import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        card: "var(--color-card)",
        "card-hover": "var(--color-card-hover)",
        border: "var(--color-border)",
        "border-hover": "var(--color-border-hover)",
        fg: "var(--color-fg)",
        brand: {
          50: "#FEFCE8",
          100: "#FEF9C3",
          200: "#FEF08A",
          300: "#FDE047",
          400: "#FACC15",
          500: "#EAB308",
          600: "#CA8A04",
          700: "#A16207",
          900: "#713F12",
          tint: "rgba(234,179,8,0.08)",
        },
        muted: "var(--color-muted)",
        dim: "var(--color-dim)",
        ink: "#111111",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-md": "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)",
        "card-lg": "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06)",
        "btn-glow": "0 6px 24px -4px rgba(234,179,8,0.45)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
