import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, PluginOption, ViteDevServer } from "vite";
import { resolve } from 'path'
import fs from 'fs'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// Plugin to handle /admin routes
const adminRoutePlugin = (): PluginOption => ({
  name: 'admin-route-handler',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      // Handle /admin and /admin/ requests
      if (req.url === '/admin' || req.url === '/admin/') {
        const adminIndexPath = resolve(projectRoot, 'public/admin/index.html')
        if (fs.existsSync(adminIndexPath)) {
          res.setHeader('Content-Type', 'text/html')
          res.end(fs.readFileSync(adminIndexPath, 'utf-8'))
          return
        }
      }
      next()
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  base: '/personal-recipes/',
  plugins: [
    react(),
    tailwindcss(),
    adminRoutePlugin(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  server: {
    port: 5000,
  }
});
