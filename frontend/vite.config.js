import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';


// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // eslint-disable-next-line no-undef
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'my-sw.js',  
        devOptions: {
          enabled: true
        },

        // workbox: {
        //   globPatterns: ['**/*.{js,css,html,svg,png}'],
        // },

        manifest: {
          "name": "Fitness Track Pro",
          "short_name": "FTP",
          "scope": "/",
          "start_url": "/",
          "display": "standalone",
          "theme_color": "#04BE00",
          "icons": [
              {
                  "src":"./src/static/img/favicon-16x16.png",
                  "sizes":"16x16",
                  "purpose": "any",
                  "type":"image/png"
              },
              {
                  "src":"./src/static/img/favicon-32x32.png",
                  "sizes":"32x32",
                  "purpose": "any",
                  "form_factor": "unset",
                  "type":"image/png"
              },
              {
                  "src":"./src/static/img/apple-touch-icon.png",
                  "sizes":"180x180",
                  "form_factor": "unset",
                  "type":"image/png"
              },
              {
                  "src":"./src/static/img/android-chrome-192x192.png",
                  "sizes":"192x192",
                  "form_factor": "unset",
                  "type":"image/png"
              },
              {
                  "src":"./src/static/img/android-chrome-512x512.png",
                  "sizes":"512x512",
                  "type":"image/png"
              },
              {
                "src":"./src/static/img/wide.png",
                "sizes":"512x512",
                "type":"image/png",
                "purpose": "any",
                "form_factor": "wide"
            }
          ]
          
      }
    }),

    ],
    server: {
      host: true,
      port: 80,
      watch: {
        usePolling: true,
      },
    },
  };
});