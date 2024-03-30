import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { VitePWA } from 'vite-plugin-pwa';

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDevelopment = env.VITE_APP_ENV === 'development';

  return defineConfig({
    plugins: [
      react(),
      viteSingleFile(),
      viteStaticCopy({
        targets: [
          {
            src: 'node_modules/@crestron/ch5-crcomlib/build_bundles/umd/cr-com-lib.js',
            dest: ''
          },
          {
            src: 'node_modules/@crestron/ch5-webxpanel/dist/umd/index.js',
            dest: ''
          },
          {
            src: 'node_modules/@crestron/ch5-webxpanel/dist/umd/d4412f0cafef4f213591.worker.js',
            dest: ''
          },
          {
            src: 'src/assets/images/favicon.ico',
            dest: 'assets/'
          },
          {
            src: 'src/assets/images/screenshot_narrow.jpg',
            dest: 'assets/'
          },
          {
            src: 'src/assets/images/screenshot_wide.jpg',
            dest: 'assets/'
          },
          {
            src: 'src/assets/images/vite.png',
            dest: 'assets/'
          }
        ]
      }),
      // Note that browsers will only allow PWA service workers to work if the server
      // presents a certificate that is signed by a CA that is trusted by the client machine.
      VitePWA({
        base: '/ch5-react-ts-template/',
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'], // Pattern to match precached files to return to the client when offline
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i, // Example for caching Google Fonts (this demo uses Google Roboto in the App.css)
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // Cache for a year
                },
                cacheableResponse: {
                    statuses: [0, 200],
                },
              },
            },
            // If there are other resources in the project that may be pulled at runtime (and not stored in the project at build time) add caching for them here.
            // Refer to the above entry as an example.
          ],
        },
        manifest: {
          // The start_url is the URL to the app index.html on the server
          start_url: "https://0.0.0.0/ch5-react-ts-template/index.html",
          // The ID is a unique identifier for the PWA. 
          // Common practice is to use the domain or subdomain of the app on its server.
          id: "/ch5-react-ts-template/",
          name: 'Crestron CH5 React PWA',
          // Keep the short name 12 characters or less for mobile devices
          short_name: 'CH5 React PWA',
          description: 'A Crestron CH5 project using React, Vite, and PWA features',
          theme_color: '#696969', 
          background_color: '#121212',
          // The display/_override is to hide browser/OS controls, making the app full screen
          display: 'standalone',
          display_override: ["window-controls-overlay","standalone"],
          lang: 'en',
          // There should be at least one icon, at a minimum of 144x144px.
          // The src property is relative to the index.html path at runtime.
          // Since the VitePWA `base` property is set to /ch5-react-ts-template/
          // the path will resolve to https://ip/ch5-react-ts-template/assets/vite.png
          icons: [
            {
              src: './assets/vite.png',
              sizes: '800x800',
              type: 'image/png',
            }
          ],
          // There should be at least two screenshots - one wide (landscape) and one narrow (portrait). These cannot be SVG
          // The src property is relative to the index.html path at runtime.
          // Since the VitePWA `base` property is set to /ch5-react-ts-template/
          // the path will resolve to https://ip/ch5-react-ts-template/assets/screenshot_something.png
          screenshots: [
            {
              src: './assets/screenshot_wide.jpg',
              sizes: '1024x593',
              form_factor: 'wide',
              type: 'image/jpeg'
            },
            {
              src: './assets/screenshot_narrow.jpg',
              sizes: '540x720',
              form_factor: 'narrow',
              type: 'image/jpeg'
            }
          ]
        },
      }),
    ],
    base: './',
    build: {
      sourcemap: isDevelopment,
    },
  });
};
