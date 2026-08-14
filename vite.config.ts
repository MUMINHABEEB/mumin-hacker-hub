import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { apiDevServer } from "./vite-plugin-api";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load server-side secrets (MONGODB_URI, JWT_SECRET, ...) into process.env for the
  // dev API bridge. Only VITE_-prefixed vars ever reach the client bundle.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [react(), apiDevServer()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      force: true,
    },
  };
});
