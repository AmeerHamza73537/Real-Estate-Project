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
      },
    }
  },
  plugins: [
    tailwindcss(),
  ],
})