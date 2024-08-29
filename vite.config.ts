import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	plugins: [react()],
	root: resolve(__dirname, "src/client"),
	publicDir: resolve(__dirname, "src/public"),
	build: {
		outDir: resolve(__dirname, "dist/client"),
		emptyOutDir: true,
	},
	test: {
		root: "./",
		include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
		globals: true,
		environment: "jsdom",
		setupFiles: "./vitest.setup.mjs",
		environmentMatchGlobs: [
			["tests/client/**", "jsdom"],
			["tests/server/**", "node"],
		],
	},
	server: {
		port: 3001,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				secure: false,
			},
		},
	},
});
