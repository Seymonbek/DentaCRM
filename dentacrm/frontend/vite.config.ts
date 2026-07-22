import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiTarget = env.VITE_API_PROXY_TARGET ?? "http://backend:8000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: true,
      // Proxy /api → backend so the frontend can call relative URLs in dev
      // without CORS friction. In prod, nginx handles routing.
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/media": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/admin": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
        "/static": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
      target: "es2022",
      // Code-splitting (T120 production-hardening pass).
      //
      // Route-level ``React.lazy(...)`` in ``src/app/router.tsx`` already
      // isolates each page into its own async chunk; the ``manualChunks``
      // config below adds a second axis of splitting for large vendor
      // libraries so:
      //
      //   * Recharts (used only by the dashboard + reports) does not end
      //     up in the initial bundle for users who never open a chart.
      //   * ``@tanstack/react-query`` + ``react-router-dom`` land in a
      //     single stable "framework" chunk with strong cache hit rate
      //     across app deployments.
      //   * ``react-hook-form`` + ``zod`` are grouped with ``@hookform``
      //     so form-heavy pages share a single chunk instead of pulling
      //     three separate ones.
      //
      // Anything not matched here falls back to Vite's default per-file
      // chunking, which is the correct behaviour for small utilities.
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("recharts") || id.includes("d3-")) return "charts";
            if (id.includes("@tanstack/react-query")) return "query";
            if (id.includes("react-router")) return "router";
            if (
              id.includes("react-hook-form") ||
              id.includes("@hookform") ||
              id.includes("zod")
            ) {
              return "forms";
            }
            if (id.includes("date-fns")) return "date-fns";
            if (id.includes("@radix-ui")) return "radix";
            return undefined;
          },
        },
      },
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./vitest.setup.ts"],
      css: false,
      include: ["src/**/*.{test,spec}.{ts,tsx}"],
    },
  };
});
