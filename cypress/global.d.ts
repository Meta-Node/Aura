export {}

declare global {
  namespace Cypress {
    interface Chainable {
      blockApiRequests(): void

      profileIntercepts(): void

      setupProfile(): void
    }

    interface Window {
      navigator: {
        clipboard: {
          __proto__: {
            readText(): Promise<string>
            writeText(text: string): Promise<void>
          }
        }
      }
    }
  }
}
