import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from 'vite-plugin-pwa'
import open, { apps } from 'open';

export default defineConfig({
  plugins: [svelte(), VitePWA({registerType: 'autoUpdate'})],
  // base: '/svelte-milkdown/', // only used for GitHub Pages
  publicDir: 'public',
  server: {
    open: '/index.html'
  }
})
