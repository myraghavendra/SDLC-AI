// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/SDLC-AI/', // 🔁 change to your repo name, NOT your GitHub username
  plugins: [react()],
})
