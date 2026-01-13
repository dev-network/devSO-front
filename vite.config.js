import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')
  return {
  define: {
      'process.env.MY_SYSTEM_VAR': JSON.stringify(env.VITE_API_URL),
    },
  plugins: [react(), tailwindcss()],
  }
})
