import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

// https://vite.dev/config/
const viteConfig =  defineConfig({
  base: '/',
  server: {
    host: 'localhost',
    port: 3000,
    open:false
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@':fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

export default viteConfig;
