import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

export default defineConfig({
  plugins: [react()],
  base: process.env.ELECTRON === 'true' ? './' : '/SSAFY_COFFY/',
  define: {
    __ELECTRON_VERSION__: JSON.stringify(pkg.electronVersion),
  },
})
