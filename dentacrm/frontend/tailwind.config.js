/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1.5rem" },
    extend: {
      colors: {
        // ── Brand (Indigo-Violet gradient system) ──────────────
        brand: {
          50:  "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
          950: "#2e1065",
        },
        // ── Semantic — wired to CSS vars ───────────────────────
        bg:          "hsl(var(--color-bg) / <alpha-value>)",
        surface:     "hsl(var(--color-surface) / <alpha-value>)",
        "surface-2": "hsl(var(--color-surface-2) / <alpha-value>)",
        "surface-3": "hsl(var(--color-surface-3) / <alpha-value>)",
        border:      "hsl(var(--color-border) / <alpha-value>)",
        "border-2":  "hsl(var(--color-border-2) / <alpha-value>)",
        ring:        "hsl(var(--color-ring) / <alpha-value>)",

        fg:    "hsl(var(--color-fg) / <alpha-value>)",
        "fg-2":"hsl(var(--color-fg-2) / <alpha-value>)",
        "fg-3":"hsl(var(--color-fg-3) / <alpha-value>)",

        success:      "hsl(var(--color-success) / <alpha-value>)",
        "success-bg": "hsl(var(--color-success-bg) / <alpha-value>)",
        warning:      "hsl(var(--color-warning) / <alpha-value>)",
        "warning-bg": "hsl(var(--color-warning-bg) / <alpha-value>)",
        danger:       "hsl(var(--color-danger) / <alpha-value>)",
        "danger-bg":  "hsl(var(--color-danger-bg) / <alpha-value>)",

        // ── Compat aliases ──────────────────────────────────────
        background:   "hsl(var(--color-bg) / <alpha-value>)",
        foreground:   "hsl(var(--color-fg) / <alpha-value>)",
        muted: {
          DEFAULT:    "hsl(var(--color-surface-2) / <alpha-value>)",
          foreground: "hsl(var(--color-fg-3) / <alpha-value>)",
        },
        primary: {
          DEFAULT:    "hsl(var(--color-primary) / <alpha-value>)",
          foreground: "hsl(var(--color-primary-fg) / <alpha-value>)",
        },
        slate: {
          50:  "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0",
          300: "#cbd5e1", 400: "#94a3b8", 500: "#64748b",
          600: "#475569", 700: "#334155", 800: "#1e293b",
          850: "#172033", 900: "#0f172a", 950: "#020617",
        },
      },
      fontFamily: {
        sans:    ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        "xs":  ["12px", { lineHeight: "18px" }],
      },
      borderRadius: {
        sm:   "6px",
        DEFAULT: "8px",
        md:   "10px",
        lg:   "12px",
        xl:   "16px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        xs:    "0 1px 2px 0 rgb(0 0 0 / 0.06)",
        sm:    "0 1px 4px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        md:    "0 4px 16px -2px rgb(0 0 0 / 0.10), 0 2px 6px -2px rgb(0 0 0 / 0.06)",
        lg:    "0 16px 40px -4px rgb(0 0 0 / 0.12), 0 4px 12px -4px rgb(0 0 0 / 0.06)",
        glow:  "0 0 32px -4px rgba(109, 77, 255, 0.45)",
        "glow-sm": "0 0 16px -2px rgba(109, 77, 255, 0.30)",
        "glow-green": "0 0 20px -4px rgba(22, 163, 74, 0.40)",
        "inner-light": "inset 0 1px 0 rgba(255,255,255,0.15)",
      },
      backgroundImage: {
        "gradient-primary":  "linear-gradient(135deg, #6d4dff 0%, #9b59f5 50%, #6d4dff 100%)",
        "gradient-surface":  "linear-gradient(180deg, hsl(var(--color-surface)) 0%, hsl(var(--color-surface-2)) 100%)",
        "gradient-radial":   "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
        "gradient-conic":    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        "slide-right": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.45" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%":      { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-up":        "fade-up 280ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "fade-down":      "fade-down 220ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "scale-in":       "scale-in 200ms cubic-bezier(0.16, 1, 0.3, 1) both",
        "slide-right":    "slide-right 280ms cubic-bezier(0.16, 1, 0.3, 1) both",
        shimmer:          "shimmer 1.8s linear infinite",
        "pulse-soft":     "pulse-soft 2.4s ease-in-out infinite",
        float:            "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 4s ease infinite",
      },
      ringWidth: { 3: "3px" },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        DEFAULT: "12px",
        md: "16px",
        lg: "24px",
        xl: "40px",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
