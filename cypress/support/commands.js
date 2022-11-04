import localforage from 'localforage'
import {
  AURA_CONNECTIONS,
  AURA_PROFILE,
  BRIGHT_ID_BACKUP_ENCRYPTED,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_PRIVATE_KEY,
  FAKE_PUBLIC_KEY,
  LOCAL_FORAGE_DATA,
  PROFILE_PICTURE,
  verificationsResponse,
} from '../utils/data'
import { CONNECTION_SEARCH_SEED } from '../../utils/constants'
import {
  auraIncomingRatingsResponse,
  auraRatingsResponse,
} from '../utils/rating'
import { AURA_ENERGIES, AURA_INBOUND_ENERGIES } from '../utils/energy'

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
      body: auraRatingsResponse,
    }
  )
  cy.intercept(
    {
      url: `/v1/ratings/inbound/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: auraIncomingRatingsResponse,
    }
  )
  cy.intercept(
    {
      url: `/v1/connections/search?fromBrightId=${FAKE_BRIGHT_ID}&seed=${CONNECTION_SEARCH_SEED}`,
      method: 'GET',
    },
    {
      body: AURA_CONNECTIONS,
    }
  )
  cy.intercept(
    {
      url: `/v1/energy/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: AURA_ENERGIES,
    }
  )
  cy.intercept(
    {
      url: `/v1/energy/inbound/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: AURA_INBOUND_ENERGIES,
    }
  )
  // node api
  cy.intercept(
    {
      url: `/brightid/v6/users/*/verifications`,
      method: 'GET',
    },
    {
      body: verificationsResponse,
    }
  )
})

Cypress.Commands.add('setupProfile', () => {
  cy.profileIntercepts()
  cy.on('window:before:load', async win => {
    localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
    await localforage.setItem('profileData', LOCAL_FORAGE_DATA)
    window.localStorage.setItem('authKey', FAKE_AUTH_KEY)
    window.localStorage.setItem('brightId', FAKE_BRIGHT_ID)
    window.localStorage.setItem('publicKey', FAKE_PUBLIC_KEY)
    window.localStorage.setItem('privateKey', FAKE_PRIVATE_KEY)
    window.localStorage.setItem('isAuth', '{"value":true}')
  })
})

Cypress.Commands.add('clearProfile', () => {
  cy.on('window:before:load', async win => {
    localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
    await localforage.removeItem('profileData')
    window.localStorage.removeItem('authKey')
    window.localStorage.removeItem('brightId')
    window.localStorage.removeItem('publicKey')
    window.localStorage.removeItem('privateKey')
    window.localStorage.removeItem('isAuth')
  })
})
