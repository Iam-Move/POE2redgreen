import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
// Use: npm run build (for web deployment)
// Use: npm run build:offline (for single HTML file)
export default defineConfig(({ mode }) => {
  const isOffline = mode === 'offline'

  return {
    plugins: isOffline ? [react(), viteSingleFile()] : [react()],
    build: {
      outDir: isOffline ? 'dist-offline' : 'dist',
      rollupOptions: isOffline ? {
        output: {
          entryFileNames: '[name].js',
        }
      } : {}
    }
  }
})
