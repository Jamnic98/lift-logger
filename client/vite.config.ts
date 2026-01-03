import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// const targetBaseUrl = 'http://lift-logger-server-dev:5000'
// const targetBaseUrl = 'http://localhost:5000'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    proxy: {},
  },
})
