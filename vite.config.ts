import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// The built site may only load its own files. This is what keeps TEE free of
// trackers and third-party scripts, so add to it only after talking it over.
const CSP =
  "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'";

const contentSecurityPolicy: Plugin = {
  name: "tee-csp",
  apply: "build",
  transformIndexHtml: () => [
    { tag: "meta", attrs: { "http-equiv": "Content-Security-Policy", content: CSP }, injectTo: "head-prepend" },
  ],
};

export default defineConfig({
  // Relative paths, so the site works at any address (GitHub Pages, a custom domain).
  base: "./",
  plugins: [react(), tailwindcss(), contentSecurityPolicy],
});
