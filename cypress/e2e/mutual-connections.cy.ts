import { AURA_GENERAL_PROFILE, FAKE_BRIGHT_ID } from '../utils/data'
import { getConnectionResponse } from '../utils/energy'
import { oldRatings } from '../utils/rating'
import {
  connectionIncomingConnections,
  connectionIncomingConnectionsResponse,
  connectionIncomingConnectionsSortByConnectionLevelDescending,
  connectionIncomingConnectionsSortByTheirRatingDescending,
  connectionIncomingRatingsResponse,
  connectionToVisit,
} from '../utils/mutual-connections'
import { IncomingConnection } from '../../types'

describe('Mutual Connections', () => {
  beforeEach(() => {
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
    cy.visit(`/profile/` + connectionToVisit.id)
  })

  function assertOrder(orderedConnections: IncomingConnection[]) {
    orderedConnections.forEach((r, i) => {
      cy.get(`[data-testid=user-item-${r.id}-name-${i}]`).should('exist')
    })
    cy.get(`[data-testid=user-item-${orderedConnections.length}]`).should(
      'not.exist'
    )
  }

  it('shows mutual connections', () => {
    assertOrder(connectionIncomingConnections)
  })

  it('sorts by incoming connection level', () => {
    cy.get('[data-testid=filter-IncomingConnectionLevel-inactive]').click()
    assertOrder(connectionIncomingConnectionsSortByConnectionLevelDescending)
  })

  it('sorts by their ratings', () => {
    cy.get('[data-testid=filter-IncomingRatingToConnection-inactive]').click()
    assertOrder(connectionIncomingConnectionsSortByTheirRatingDescending)
  })
})
