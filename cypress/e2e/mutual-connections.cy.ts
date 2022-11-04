import {
  AURA_GENERAL_PROFILE,
  FAKE_BRIGHT_ID,
  unratedConnection,
} from '../utils/data'
import { Connection } from '../../types'
import { getConnectionResponse } from '../utils/energy'
import { oldRatings } from '../utils/rating'

describe('Mutual Connections', () => {
  beforeEach(() => {
    cy.on('window:before:load', win => {
      cy.spy(win.console, 'error').as('spyWinConsoleError')
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn')
    })
    // @ts-ignore
    cy.blockApiRequests()
    // @ts-ignore
    cy.setupProfile()
  })

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  function goToConnectionProfile(connection: Connection) {
    cy.intercept(
      {
        url: `/v1/profile/${connection.id}`,
        method: 'GET',
      },
      {
        body: AURA_GENERAL_PROFILE,
      }
    )
    cy.intercept(
      {
        url: `/v1/connections/${FAKE_BRIGHT_ID}/${connection.id}`,
        method: 'GET',
      },
      {
        body: getConnectionResponse(connection, oldRatings),
      }
    )
    cy.get(`[data-testid^=user-item-${connection.id}-name]`).click()
  }

  it('shows mutual connections', () => {
    cy.visit(`/connections/`)
    goToConnectionProfile(unratedConnection)
  })
})
