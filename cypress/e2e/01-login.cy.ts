import {
  BRIGHT_ID_BACKUP,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_USER_EXPLORER_CODE,
  FAKE_USER_PASSWORD,
} from '../utils/data'

describe('Login', () => {
  beforeEach(() => {
    cy.on('window:before:load', win => {
      cy.spy(win.console, 'error').as('spyWinConsoleError')
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn')
    })
    cy.intercept(
      {
        url: `**/api/**`,
      },
      {
        statusCode: 404,
      }
    )
  })

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  it('login', () => {
    cy.visit('/')
    cy.get('[data-testid=login-explorer-code]').type(FAKE_USER_EXPLORER_CODE)
    cy.get('[data-testid=login-password]').type(FAKE_USER_PASSWORD)
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        body: 'OK',
      }
    )
    cy.intercept(
      {
        url: `/brightid/backups/${FAKE_AUTH_KEY}/data`,
        method: 'GET',
      },
      {
        body: BRIGHT_ID_BACKUP,
      }
    )
    cy.get('[data-testid=login-submit]').click()
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
  })
})
