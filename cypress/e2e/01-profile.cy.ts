import {
  AURA_LEVEL,
  AURA_PROFILE,
  BRIGHT_ID_BACKUP,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_BRIGHT_ID_PASSWORD,
  FAKE_USER_EXPLORER_CODE,
  unratedConnection,
} from '../utils/data'
import { TOAST_ERROR } from '../../utils/constants'
import { AURA_ENERGIES, AURA_INBOUND_ENERGIES } from '../utils/energy'
import { incomingRatings, oldRatings } from '../utils/rating'

describe('Login', () => {
  beforeEach(() => {
    cy.on('window:before:load', win => {
      cy.spy(win.console, 'error').as('spyWinConsoleError')
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn')
    })
    // @ts-ignore
    cy.blockApiRequests()
  })

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  it('login', () => {
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        body: 'OK',
      }
    ).as('explorerCode')
    // @ts-ignore
    cy.clearProfile()
    // @ts-ignore
    cy.profileIntercepts()
    cy.visit('/')
    cy.get('[data-testid=login-explorer-code]').type(FAKE_USER_EXPLORER_CODE)
    cy.get('[data-testid=login-password]').type(FAKE_BRIGHT_ID_PASSWORD)
    cy.get('[data-testid=login-submit]').click()
    cy.wait('@explorerCode')
      .its('request.body')
      .should(body => {
        expect(body.brightId).to.eq(FAKE_BRIGHT_ID)
        expect(body.password).to.eq(FAKE_BRIGHT_ID_PASSWORD)
        expect(body.key).to.eq(FAKE_AUTH_KEY)
        // eslint-disable-next-line no-unused-expressions
        expect(body.publicKey).to.be.not.null
      })
      .then(() => {
        expect(localStorage.getItem('brightId')).to.eq(FAKE_BRIGHT_ID)
        // localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
        // const data = await localforage.getItem('profileData')
        // expect(data).to.deep.eq(LOCAL_FORAGE_DATA)
      })
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
  })

  it('handle login failed response', () => {
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        statusCode: 500,
      }
    ).as('explorerCodeError')
    // @ts-ignore
    cy.clearProfile()
    // @ts-ignore
    cy.profileIntercepts()
    cy.visit('/')
    cy.get('[data-testid=login-explorer-code]').type(FAKE_USER_EXPLORER_CODE)
    cy.get('[data-testid=login-password]').type(FAKE_BRIGHT_ID_PASSWORD)
    cy.get('[data-testid=login-submit]').click()
    cy.url().should('not.include', `/profile/${FAKE_BRIGHT_ID}`)
    cy.get(`.toast--${TOAST_ERROR}`)
  })

  function showsProfileInfo() {
    BRIGHT_ID_BACKUP.userData.name.split(' ').forEach(s => {
      cy.get(`[data-testid=profile-user-name]`).contains(s)
    })
    cy.get(`[data-testid=profile-user-info]`).contains(
      `${AURA_PROFILE.numOfConnections} Connections`
    )
  }

  function showsYetToBeRated() {
    cy.get(`[data-testid=user-v1-${unratedConnection.id}-name]`).contains(
      unratedConnection.name
    )
  }

  function showsAuraStatistics() {
    cy.get('[data-testid=aura-statistics-energy-in]').contains(
      AURA_INBOUND_ENERGIES.energy.length
    )
    cy.get('[data-testid=aura-statistics-energy-out]').contains(
      AURA_ENERGIES.energy.length
    )
    cy.get('[data-testid=aura-statistics-honesty-in]').contains(
      incomingRatings.length
    )
    cy.get('[data-testid=aura-statistics-honesty-out]').contains(
      oldRatings.length
    )
  }

  it('profile', () => {
    // @ts-ignore
    cy.setupProfile()

    cy.visit('/')
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
    showsProfileInfo()
    showsYetToBeRated()
    cy.get('[data-testid=profile-info-aura-level]').contains(AURA_LEVEL)
    showsAuraStatistics()
  })
})
