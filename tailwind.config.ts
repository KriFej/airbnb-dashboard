import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#000000",
        surface: "#0A0A0A",
        card: "#111111",
        "card-hover": "#161616",
        border: "#1F1F1F",
        "border-hover": "#2A2A2A",
        brand: {
          50: "#F0FDF4",
          400: "#4ADE80",
          500: "#22C55E",
          600: "#16A34A",
          700: "#15803D",
          900: "#14532D",
          tint: "rgba(34,197,94,0.08)",
        },
        muted: "#A1A1AA",
        dim: "#71717A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 80px rgba(34,197,94,0.25)",
        "glow-sm": "0 0 40px rgba(34,197,94,0.18)",
        "btn-glow": "0 8px 30px -6px rgba(34,197,94,0.6)",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-green":
          "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(34,197,94,0.18), transparent 70%)",
      },
      backgroundSize: {
        grid: "48px 48px",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        pulse: "pulse 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
