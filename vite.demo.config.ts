import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// Standalone demo build. Kept out of dist/ so npm package entrypoints remain
// clean and predictable for consumers.
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist-demo",
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, "index.html"),
        },
    },
})
