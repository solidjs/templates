import * as path from 'path'
import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
    clearScreen: false,
    envPrefix: ['VITE_', 'TAURI_'],
    resolve: {
        alias: {
            '@interfaces': path.resolve(__dirname, './src/interfaces'),
            '@components': path.resolve(__dirname, './src/components'),
            '@redux': path.resolve(__dirname, './src/redux'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@config': path.resolve(__dirname, './src/config'),
            '@src': path.resolve(__dirname, './src'),
            '@assets': path.resolve(__dirname, './assets'),
            '@hooks': path.resolve(__dirname, './src/utils/hooks'),
            '@static': path.resolve(__dirname, './src/static'),
            '@utils': path.resolve(__dirname, './src/utils'),
        },
    },
    plugins: [solidPlugin()],
    server: {
        port: 3000,
        host: true,
        strictPort: true,
    },
    build: {
        // Tauri supports es2021
        target: ['es2021', 'chrome100', 'safari13', 'esnext'],
        // don't minify for debug builds
        minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
        // produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_DEBUG,
    }
})
