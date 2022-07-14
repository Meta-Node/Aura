import {
  AURA_PROFILE,
  AURA_RATINGS,
  BRIGHT_ID_BACKUP_ENCRYPTED,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  PROFILE_PICTURE,
} from '../utils/data'

Cypress.Commands.add('shouldBeCalled', (alias, timesCalled) => {
  expect(
    cy.state('requests').filter(call => call.alias === alias),
    `${alias} should have been called ${timesCalled} times`
  ).to.have.length(timesCalled)
})

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
Cypress.Commands.add('blockApiRequests', () => {
  cy.intercept(
    {
      url: `**/v1/**`,
    },
    {
      statusCode: 404,
    }
  )
  cy.intercept(
    {
      url: `**/brightid/**`,
    },
    {
      statusCode: 404,
    }
  )
})
Cypress.Commands.add('profileIntercepts', () => {
  cy.intercept(
    {
      url: `/v1/connect/explorer-code`,
      method: 'POST',
    },
    {
      body: 'OK',
    }
  ).as('explorerCode')
  cy.intercept(
    {
      url: `/brightid/backups/*/*`,
      method: 'GET',
    },
    {
      body: PROFILE_PICTURE,
    }
  )
  cy.intercept(
    {
      url: `/brightid/backups/${FAKE_AUTH_KEY}/data`,
      method: 'GET',
    },
    {
      body: BRIGHT_ID_BACKUP_ENCRYPTED,
    }
  )
  cy.intercept(
    {
      url: `/v1/profile/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: AURA_PROFILE,
    }
  )
  cy.intercept(
    {
      url: `/v1/ratings/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: AURA_RATINGS,
    }
  )
})
