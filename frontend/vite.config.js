import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// https://vite.dev/config/
export default defineConfig({
  base: isProduction ? '/static/' : '/',
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, '../backend/static'),
    assetsDir: "assets",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
  define: {
    "process.env": process.env,
  }
});
