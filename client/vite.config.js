// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  // Creating proxy to request to the server
  server: {
    proxy: {
      '/api':{
        target: 'http://localhost:3000',
        secure: false,
        changeOrigin: true,
        ws: true,
        withCredentials: true,
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            const setCookie = proxyRes.headers['set-cookie']
            if (setCookie) {
              // Remove SameSite and Secure flags in dev so the browser accepts cookies via the proxy
              proxyRes.headers['set-cookie'] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*SameSite=[^;]+/i, '')
                  .replace(/;\s*Secure/i, '')
              )
            }
          })
        }
      },
    }
  },
  plugins: [
    tailwindcss(), 
  ],
})