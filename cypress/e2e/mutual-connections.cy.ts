import { AURA_GENERAL_PROFILE, FAKE_BRIGHT_ID } from '../utils/data'
import { getConnectionResponse } from '../utils/energy'
import { oldRatings } from '../utils/rating'
import {
  connectionIncomingConnections,
  connectionIncomingConnectionsResponse,
  connectionIncomingRatingsResponse,
  connectionToVisit,
} from '../utils/mutual-connections'
import { IncomingConnection } from '../../types'

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

    cy.intercept(
      {
        url: `/v1/profile/${connectionToVisit.id}`,
        method: 'GET',
      },
      {
        body: AURA_GENERAL_PROFILE,
      }
    )
    cy.intercept(
      {
        url: `/v1/connections/${FAKE_BRIGHT_ID}/${connectionToVisit.id}`,
        method: 'GET',
      },
      {
        body: getConnectionResponse(connectionToVisit, oldRatings),
      }
    )
    cy.intercept(
      {
        url: `/node/v6/users/${connectionToVisit.id}/connections/inbound`,
        method: 'GET',
      },
      {
        body: connectionIncomingConnectionsResponse,
      }
    )
    cy.intercept(
      {
        url: `/v1/ratings/inbound/${connectionToVisit.id}`,
        method: 'GET',
      },
      {
        body: connectionIncomingRatingsResponse,
      }
    )
  })

  function assertOrder(orderedConnections: IncomingConnection[]) {
    orderedConnections.forEach((r, i) => {
      cy.get(`[data-testid=user-item-${r.id}-name-${i}]`).should('exist')
    })
    cy.get(`[data-testid=user-item-${orderedConnections.length}]`).should(
      'not.exist'
    )
  }

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  it('shows mutual connections', () => {
    cy.visit(`/profile/` + connectionToVisit.id)
    assertOrder(connectionIncomingConnections)
  })
})
