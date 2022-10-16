import { defineConfig } from "vite";

export default defineConfig({
    define: {
        "import.meta.vitest": "undefined"
    },
    base: "Elite-Bearing",
    test: {
        includeSource: [
            "src/**/*.ts"
        ]
    }
})