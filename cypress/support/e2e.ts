// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
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
import {
  userIncomingRatingsResponse,
  userRatingsResponse,
} from '../utils/rating'
import { CONNECTION_SEARCH_SEED } from '../../utils/constants'
import { AURA_ENERGIES, AURA_INBOUND_ENERGIES } from '../utils/energy'

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
      body: userRatingsResponse,
    }
  )
  cy.intercept(
    {
      url: `/v1/ratings/inbound/${FAKE_BRIGHT_ID}`,
      method: 'GET',
    },
    {
      body: userIncomingRatingsResponse,
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
  localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
  localforage.setItem('profileData', LOCAL_FORAGE_DATA)
  cy.profileIntercepts()
  cy.on('window:before:load', _win => {
    window.localStorage.setItem('authKey', FAKE_AUTH_KEY)
    window.localStorage.setItem('brightId', FAKE_BRIGHT_ID)
    window.localStorage.setItem('publicKey', FAKE_PUBLIC_KEY)
    window.localStorage.setItem('privateKey', FAKE_PRIVATE_KEY)
  })
})

beforeEach(() => {
  cy.blockApiRequests()
  cy.on('window:before:load', win => {
    cy.spy(win.console, 'error').as('spyWinConsoleError')
    cy.spy(win.console, 'warn').as('spyWinConsoleWarn')
  })
})

afterEach(() => {
  cy.get('@spyWinConsoleError').should('have.callCount', 0)
  cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
})
