import { defineConfig } from 'vite'
const { resolve, join } = require('path')
import react from '@vitejs/plugin-react'
import ViteFonts from 'vite-plugin-fonts'
import { rmSync } from 'fs'
import electron, { onstart } from 'vite-plugin-electron'
import pkg from './package.json'

rmSync('dist', { recursive: true, force: true }) // v14.14.0
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@contexts': resolve(__dirname, 'src/contexts'),
      '@constants': resolve(__dirname, 'src/constants'),
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // nested: resolve(__dirname, 'getting-started/index.html')
        // main: join(__dirname, '../../', 'html', 'index.html')
        // main: resolve(__dirname, '..', 'html/index.html')
      }
    }
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: join(__dirname, 'electron/main/index.ts'),
        vite: {
          build: {
            // For Debug
            sourcemap: true,
            outDir: 'dist/electron/main',
          },
          // Will start Electron via VSCode Debug
          plugins: [process.env.VSCODE_DEBUG ? onstart() : null],
        },
      },
      preload: {
        input: {
          // You can configure multiple preload here
          index: join(__dirname, 'electron/preload/index.ts'),
        },
        vite: {
          build: {
            // For Debug
            sourcemap: 'inline',
            outDir: 'dist/electron/preload',
          },
        },
      }
    }),
    ViteFonts({
      google: {
        families: ['Open Sans',
        {
          name: 'Open Sans',
          styles: 'wght@400,500,600,700'
        }
      ],
      },
    }),
   ],
  server: {
    proxy: {
      '/graphql': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
        secure: false,
        ws: true,
      }
    },
    host: pkg.debug.env.VITE_DEV_SERVER_HOSTNAME,
    port: pkg.debug.env.VITE_DEV_SERVER_PORT,
  },
  // base: '/dashboard/html/',
  // build: {
  //   // assetsDir: '/dashboard/html/',
  //   outDir: '../html',
  //   emptyOutDir: true
  // }
})

