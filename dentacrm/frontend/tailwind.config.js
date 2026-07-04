/**
 * Tailwind configuration for DentaCRM SPA.
 *
 * * ``darkMode: 'class'`` — the frontend swaps ``<html>`` classes based
 *   on the user's theme choice from Settings (light / dark / system).
 *   See ``src/app/ThemeProvider.tsx``.
 * * Brand palette anchored on ``#2563EB`` (light-mode primary) with
 *   ``#3B82F6`` as the dark-mode primary — both are taken straight
 *   from the PROJECT_BRIEF § "Design System" table.
 * * Semantic color tokens (``surface``, ``muted``, ``danger`` …) are
 *   emitted twice, once for light and once for dark, using CSS variables
 *   defined in ``src/index.css`` so components can reference them with
 *   ``bg-surface``, ``text-muted``, etc.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },
    extend: {
      // ---------------------------------------------------------------
      // Colors
      // ---------------------------------------------------------------
      colors: {
        // Brand palette — light-mode primary #2563EB, dark-mode #3B82F6.
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6", // dark-mode primary
          600: "#2563eb", // light-mode primary
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
        // Semantic tokens are wired to CSS variables in index.css so the
        // same class (e.g. bg-surface) resolves correctly in both themes.
        background: "hsl(var(--color-background) / <alpha-value>)",
        surface: "hsl(var(--color-surface) / <alpha-value>)",
        border: "hsl(var(--color-border) / <alpha-value>)",
        input: "hsl(var(--color-border) / <alpha-value>)",
        ring: "hsl(var(--color-ring) / <alpha-value>)",
        foreground: "hsl(var(--color-foreground) / <alpha-value>)",
        muted: {
          DEFAULT: "hsl(var(--color-muted) / <alpha-value>)",
          foreground: "hsl(var(--color-muted-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--color-primary) / <alpha-value>)",
          foreground: "hsl(var(--color-primary-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--color-success) / <alpha-value>)",
          foreground: "hsl(var(--color-success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--color-warning) / <alpha-value>)",
          foreground: "hsl(var(--color-warning-foreground) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--color-danger) / <alpha-value>)",
          foreground: "hsl(var(--color-danger-foreground) / <alpha-value>)",
        },
      },
      // ---------------------------------------------------------------
      // Typography
      // ---------------------------------------------------------------
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      // ---------------------------------------------------------------
      // Radius (matches design-system spec: 8px card, 6px input/button)
      // ---------------------------------------------------------------
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "12px",
      },
      // ---------------------------------------------------------------
      // Motion
      // ---------------------------------------------------------------
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 150ms ease-out",
        "scale-in": "scale-in 120ms ease-out",
        shimmer: "shimmer 1.4s linear infinite",
      },
    },
  },
  plugins: [],
};
