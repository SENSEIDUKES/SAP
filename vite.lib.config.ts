import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import dts from "vite-plugin-dts"

// Library build configuration for publishing as npm package
export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ["src/audio-player"],
            exclude: ["src/**/__tests__/**"],
            outDir: "dist",
            strictOutput: true,
            rollupTypes: true,
        }),
    ],
    build: {
        lib: {
            entry: "src/audio-player/index.ts",
            formats: ["es", "cjs"],
            fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
            cssFileName: "styles",
        },
        outDir: "dist",
        rollupOptions: {
            external: ["react", "react-dom", "essentia.js", "wavesurfer.js"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
                exports: "named",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith(".css")) {
                        return "styles.css"
                    }
                    return assetInfo.name ?? "[name][extname]"
                },
            },
        },
        sourcemap: true,
        minify: false,
        cssCodeSplit: true,
    },
})
