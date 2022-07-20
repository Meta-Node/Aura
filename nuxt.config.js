require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

const title = 'Discover & grow your Aura...'
const description = 'Your Aura represents power & influence upon the Auracle.'

export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  server: {
    port: '3000',
    host: '0.0.0.0',
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: description,
      },

      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: title,
      },
      {
        name: 'twitter:description',
        content: description,
      },
      {
        name: 'twitter:image',
        content: '/icon.png',
      },
      {
        property: 'og:image',
        content: '/icon.png',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'Aura',
      },
      {
        hid: 'og:title',
        name: 'og:title',
        content: title,
      },
      {
        hid: 'og:description',
        name: 'og:title',
        content: description,
      },
      { hid: 'theme-color', name: 'theme-color', content: '#333333' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['@/styles/index.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    '@nuxtjs/localforage',
    '@nuxt/image',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    ['@nuxtjs/dotenv', { filename: `.env.${process.env.NODE_ENV}` }],
    '@nuxtjs/pwa',
    '@nuxtjs/axios',
  ],

  proxy: {
    '/brightid': {
      target: 'https://recovery.brightid.org',
      changeOrigin: true,
      pathRewrite: { '^/brightid': '/' },
    },
  },

  axios: {
    proxy: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
      theme_color: '#FDFAF3',
    },
    icon: {
      fileName: 'icon.png',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.glsl$/,
        exclude: '/node_modules/',
        loader: 'webpack-glsl-loader',
      })
    },
  },
  // generate: { fallback: '404.html' },
}
