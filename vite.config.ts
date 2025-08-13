import { defineConfig } from 'vite'

export default defineConfig({
  base : process.env.BASE_URL || "/SDLC-AI/", // Your GitHub repository name
  build: {
    outDir: 'dist'
  }
})