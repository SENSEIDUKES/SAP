import { resolve } from "node:path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

const external = ["react", "react-dom", "react/jsx-runtime"]

// Packageable audio-player library build. The standalone demo uses
// vite.demo.config.ts so its HTML/assets stay separate from dist/.
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "dist",
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, "src/audio-player/index.ts"),
            name: "SEIHouseAudioPlayer",
            formats: ["es", "cjs"],
            fileName: (format) => (format === "es" ? "index.js" : "index.cjs"),
            cssFileName: "styles",
        },
        rollupOptions: {
            external,
            output: {
                exports: "named",
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "react/jsx-runtime": "jsxRuntime",
                },
            },
        },
    },
})
