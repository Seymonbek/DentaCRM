/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_API_PROXY_TARGET?: string;
  readonly VITE_REFRESH_STORAGE?: "memory" | "local";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
