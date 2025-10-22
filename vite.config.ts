import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // <-- Make sure to import 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This line tells Vite that '@' is a shortcut for the 'src' folder
      '@': path.resolve(__dirname, './src'),
    },
  },
})
