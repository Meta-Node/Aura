import {AURA_GENERAL_PROFILE, FAKE_BRIGHT_ID} from '../utils/data'
import {AURA_ENERGIES, AURA_INBOUND_ENERGIES, getConnectionResponse} from '../utils/energy'
import {oldRatings} from '../utils/rating'
import {
  connectionIncomingConnections,
  connectionIncomingConnectionsResponse,
  connectionIncomingConnectionsSortByConnectionLevelDescending,
  connectionIncomingConnectionsSortByTheirRatingDescending,
  connectionIncomingRatingsResponse,
  connectionOutboundConnectionsResponse,
  connectionToVisit,
} from '../utils/mutual-connections'
import {BrightIdConnection} from '../../types'
import {MUTUAL_CONNECTIONS_TEST_NAMESPACE} from "../../utils/constants";

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
        url: `/node/v6/users/${connectionToVisit.id}/connections/outbound`,
        method: 'GET',
      },
      {
        body: connectionOutboundConnectionsResponse,
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
    cy.intercept(
      {
        url: `/v1/ratings/${connectionToVisit.id}`,
        method: 'GET',
      },
      {
        body: connectionIncomingRatingsResponse,
      }
    )
    cy.intercept(
      {
        url: `/v1/energy/${connectionToVisit.id}`,
        method: 'GET',
      },
      {
        body: AURA_ENERGIES,
      }
    )
    cy.intercept(
      {
        url: `/v1/energy/inbound/${connectionToVisit.id}`,
        method: 'GET',
      },
      {
        body: AURA_INBOUND_ENERGIES,
      }
    )
  })

  function assertOrder(orderedConnections: BrightIdConnection[]) {
    orderedConnections.forEach((r, i) => {
      cy.get(`[data-testid=${MUTUAL_CONNECTIONS_TEST_NAMESPACE}user-item-${r.id}-name-${i}]`).should('be.visible')
    })
    cy.get(`[data-testid=${MUTUAL_CONNECTIONS_TEST_NAMESPACE}user-item-${orderedConnections.length}]`).should(
      'not.exist'
    )
  }

  it('shows mutual connections', () => {
    cy.visit(`/profile/` + connectionToVisit.id)
    assertOrder(connectionIncomingConnections)
  })

  it('sorts by incoming connection level', () => {
    cy.visit(`/profile/` + connectionToVisit.id)
    cy.get('[data-testid=filter-IncomingConnectionLevel-inactive]').click()
    assertOrder(connectionIncomingConnectionsSortByConnectionLevelDescending)
  })

  it('sorts by their ratings', () => {
    cy.visit(`/profile/` + connectionToVisit.id)
    cy.get('[data-testid=filter-IncomingRatingToConnection-inactive]').click()
    assertOrder(connectionIncomingConnectionsSortByTheirRatingDescending)
  })
})
