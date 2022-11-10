// https://github.com/cypress-io/cypress/issues/2752#issuecomment-1039285381
Cypress.on('window:before:load', win => {
  let copyText

  if (!win.navigator.clipboard) {
    win.navigator.clipboard = {
      __proto__: {},
    }
  }

  // eslint-disable-next-line no-proto
  win.navigator.clipboard.__proto__.writeText = text => (copyText = text)
  // eslint-disable-next-line no-proto
  win.navigator.clipboard.__proto__.readText = () => copyText
})
