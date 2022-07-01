import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    video: false,
    defaultCommandTimeout: 10000,
    viewportWidth: 1366,
    viewportHeight: 768,
  },
})
