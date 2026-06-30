import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages project site is served from /<repo>/.
// For a custom domain or Vercel, set base to '/'.
// Override at build time with: BASE_PATH=/ npm run build
const base = process.env.BASE_PATH ?? '/ojas-portfolio/'

export default defineConfig({
  base,
  plugins: [react()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
  },
})
