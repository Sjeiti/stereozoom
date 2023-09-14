import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

export default defineConfig({
  server: {
    open: 'index.html',
  },
  root: 'src',
  publicDir: '../static',
  build: {
    outDir: '../dist'
  },
  resolve: {
    alias: { '/src': path.resolve(process.cwd(), 'src') }
  },
  plugins: [eslint()]
})
