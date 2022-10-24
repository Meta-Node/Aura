import {
  AURA_GENERAL_PROFILE,
  FAKE_BRIGHT_ID,
  justMet2,
  ratedConnection,
  ratedConnectionNegative,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from '../utils/data'
import { AuraRating, AuraRatingRetrieveResponse, Connection } from '../../types'
import { getStepName, valueToStep } from '../../utils/rating'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'
import { getConnectionResponse } from '../utils/energy'
import {
  connectionsInCommunityFilterAll,
  connectionsInCommunityFilterAllSortedByNameAscending,
  connectionsInCommunityFilterAllSortedByNameDescending,
  connectionsInCommunityJustMet,
  connectionsInCommunityJustMetSortedByNameAscending,
  connectionsInCommunityJustMetSortedByNameDescending,
  getRating,
  newRatings,
  oldRatings,
} from '../utils/rating'

describe('Community', () => {
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

  let currentRatings: AuraRating[] = Object.assign([], oldRatings)

  function setNewRating(connection: Connection) {
    const newRating = newRatings.find(r => r.toBrightId === connection.id)
    if (newRating) {
      currentRatings = [
        ...currentRatings.filter(r => r.toBrightId !== connection.id),
        newRating,
      ]
    }
    const ratingResponse: AuraRatingRetrieveResponse = {
      ratings: currentRatings,
    }
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: ratingResponse,
      }
    )
    cy.intercept(
      {
        url: `/v1/connections/${FAKE_BRIGHT_ID}/${connection.id}`,
        method: 'GET',
      },
      {
        body: getConnectionResponse(connection, newRatings),
      }
    )
  }

  function submitNewRatingFailure(connection: Connection) {
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}/${connection.id}`,
        method: 'POST',
      },
      {
        statusCode: 500,
      }
    ).as('submitRatingError')
    cy.get('[data-testid=feedback-quality-confirm]').click()
    cy.wait('@submitRatingError')
    cy.get(`.toast--${TOAST_ERROR}`)
  }

  function submitNewRatingSuccess(connection: Connection) {
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}/${connection.id}`,
        method: 'POST',
      },
      {
        statusCode: 200,
      }
    ).as('submitRating')
    setNewRating(connection)

    cy.get('[data-testid=feedback-quality-confirm]').click()
    cy.wait('@submitRating')
      .its('request.body')
      .should(body => {
        expect(body).to.have.key('encryptedRating')
      })
    cy.get(`.toast--${TOAST_SUCCESS}`)
  }

  function submitNewRatingNoChange(connection: Connection) {
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}/${connection.id}`,
        method: 'POST',
      },
      {
        statusCode: 500,
      }
    ).as('submitRatingError')
    setNewRating(connection)

    cy.get('[data-testid=feedback-quality-confirm]').click()
    // should not be called
    cy.get('@submitRatingError.all').should('have.length', 0)
    cy.get(`.toast--${TOAST_SUCCESS}`, { timeout: 1 }).should('not.exist')
    cy.get(`.toast--${TOAST_ERROR}`, { timeout: 1 }).should('not.exist')
    cy.url().should('include', `/connections`)
  }

  function showsRateValue(connection: Connection, ratings: AuraRating[]) {
    const ratingValue = Number(getRating(connection.id, ratings) || 0)
    cy.get('[data-testid=feedback-quality-value]').contains(
      getStepName(ratingValue)!
    )
    cy.get('[data-testid=feedback-quality-input]').should(
      'have.value',
      valueToStep[ratingValue]
    )
  }

  function goToRatePage(connection: Connection) {
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
    showsRateValue(connection, oldRatings)
  }

  function setNewRateValue(connection: Connection) {
    const newRatingValue = Number(getRating(connection.id, newRatings))
    cy.get('[data-testid=feedback-quality-input]')
      .invoke('val', valueToStep[newRatingValue])
      .trigger('input')
  }

  function doRate(connection: Connection) {
    goToRatePage(connection)
    setNewRateValue(connection)

    // set new rating value
    const oldRatingValue = Number(getRating(connection.id, oldRatings))
    const newRatingValue = Number(getRating(connection.id, newRatings))

    showsRateValue(connection, newRatings)
    if (newRatingValue === oldRatingValue) {
      submitNewRatingNoChange(connection)
    } else {
      submitNewRatingFailure(connection)
      submitNewRatingSuccess(connection)
    }
    cy.get(`[data-testid^=user-item-${connection.id}-name]`).click()
    showsRateValue(connection, newRatings)
    cy.go(-1)
  }

  function checkConnectionOrderInViewTab(brightId: string, index: number) {
    cy.get(`[data-testid=user-item-${brightId}-name-${index}]`).should('exist')
  }

  function assertOrder(orderedConnections: Connection[]) {
    orderedConnections.forEach((r, i) => {
      checkConnectionOrderInViewTab(r.id, i)
    })
  }

  it('filters and sorts connections', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInCommunityFilterAll)

    expect(connectionsInCommunityFilterAll).to.not.deep.equal(
      connectionsInCommunityJustMet
    )

    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    assertOrder(connectionsInCommunityJustMet)
  })

  it('sorts connections', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInCommunityFilterAll)

    expect(connectionsInCommunityFilterAll).to.not.deep.equal(
      connectionsInCommunityFilterAllSortedByNameAscending
    )
    expect(connectionsInCommunityFilterAll).to.not.deep.equal(
      connectionsInCommunityFilterAllSortedByNameDescending
    )

    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInCommunityFilterAllSortedByNameAscending)

    cy.get('[data-testid=filter-Name-ascending').click()
    assertOrder(connectionsInCommunityFilterAllSortedByNameDescending)

    cy.get('[data-testid=filter-Name-descending').should('exist')
  })

  it('orders filtered list', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInCommunityFilterAll)

    expect(connectionsInCommunityFilterAll).to.not.deep.equal(
      connectionsInCommunityJustMet
    )
    expect(connectionsInCommunityJustMet).to.not.deep.equal(
      connectionsInCommunityJustMetSortedByNameAscending
    )
    expect(connectionsInCommunityJustMet).to.not.deep.equal(
      connectionsInCommunityJustMetSortedByNameDescending
    )

    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    assertOrder(connectionsInCommunityJustMet)

    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInCommunityJustMetSortedByNameAscending)

    cy.get('[data-testid=filter-Name-ascending').click()
    assertOrder(connectionsInCommunityJustMetSortedByNameDescending)

    cy.get('[data-testid=filter-Name-descending').should('exist')
  })

  it('filters ordered list', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInCommunityFilterAll)

    expect(connectionsInCommunityFilterAll).to.not.deep.equal(
      connectionsInCommunityFilterAllSortedByNameAscending
    )
    expect(
      connectionsInCommunityFilterAllSortedByNameAscending
    ).to.not.deep.equal(connectionsInCommunityJustMetSortedByNameAscending)

    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInCommunityFilterAllSortedByNameAscending)

    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    assertOrder(connectionsInCommunityJustMetSortedByNameAscending)

    cy.get('[data-testid=filter-Name-ascending').should('exist')
  })

  it('keeps filters when navigating', () => {
    cy.visit(`/connections/`)
    expect(connectionsInCommunityFilterAll).to.not.deep.equal(
      connectionsInCommunityJustMetSortedByNameAscending
    )

    assertOrder(connectionsInCommunityFilterAll)
    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInCommunityJustMetSortedByNameAscending)

    cy.get(`[data-testid^=user-item-${justMet2.id}-name]`).click()
    cy.go(-1)

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)
    assertOrder(connectionsInCommunityJustMetSortedByNameAscending)
  })

  it('keeps filters after reload', () => {
    cy.visit(`/connections/`)
    expect(connectionsInCommunityFilterAll).to.not.deep.equal(
      connectionsInCommunityJustMetSortedByNameAscending
    )

    assertOrder(connectionsInCommunityFilterAll)
    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInCommunityJustMetSortedByNameAscending)

    cy.reload()
    assertOrder(connectionsInCommunityJustMetSortedByNameAscending)
  })

  it('rates an unrated connection', () => {
    cy.visit(`/connections/`)
    cy.get(`[data-testid^=user-item-${unratedConnection.id}-name]`).contains(
      unratedConnection.name
    )
    doRate(unratedConnection)
  })

  it('rates a rated connection', () => {
    cy.visit(`/connections/`)
    cy.get(`[data-testid^=user-item-${ratedConnection.id}-name]`).contains(
      ratedConnection.name
    )
    doRate(ratedConnection)
  })

  it('does not send request for an unchanged rate', () => {
    cy.visit(`/connections/`)
    cy.get(
      `[data-testid^=user-item-${ratedConnectionWithoutEnergy.id}-name]`
    ).contains(ratedConnectionWithoutEnergy.name)
    doRate(ratedConnectionWithoutEnergy)
  })

  it('can change a negative rate', () => {
    cy.visit(`/connections/`)
    cy.get(
      `[data-testid^=user-item-${ratedConnectionNegative.id}-name]`
    ).contains(ratedConnectionNegative.name)
    doRate(ratedConnectionNegative)
  })

  function submitNewRatingEncryptFailure(connection: Connection) {
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}/${connection.id}`,
        method: 'POST',
      },
      {
        statusCode: 500,
        body: `Could not decrypt using publicKey: ${FAKE_BRIGHT_ID}`,
      }
    ).as('submitRatingEncryptError')
    cy.get('[data-testid=feedback-quality-confirm]').click()
    cy.wait('@submitRatingEncryptError')
    cy.get(`.toast--${TOAST_ERROR}`)
    cy.url().should('not.include', 'profile')
  }

  it('logs out the user if the privateKey is invalid', () => {
    cy.visit(`/connections/`)
    cy.get(`[data-testid^=user-item-${unratedConnection.id}-name]`).contains(
      unratedConnection.name
    )
    goToRatePage(unratedConnection)
    setNewRateValue(unratedConnection)
    submitNewRatingEncryptFailure(unratedConnection)
  })
})
