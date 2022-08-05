import {
  AURA_GENERAL_PROFILE,
  FAKE_BRIGHT_ID,
  getConnectionResponse,
  getRating,
  newRatings,
  oldRatings,
  ratedConnection,
  ratedConnectionNegative,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from '../utils/data'
import { AuraRating, Connection } from '../../types'
import { getStepName, valueToStep } from '../../utils/rating'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'

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
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: { ratings: currentRatings },
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
    cy.url().should('include', `/community`)
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

  function doRate(connection: Connection) {
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
    cy.get(`[data-testid=user-v1-${connection.id}-name]`).click()
    showsRateValue(connection, oldRatings)

    // set new rating value
    const oldRatingValue = Number(getRating(connection.id, oldRatings))
    const newRatingValue = Number(getRating(connection.id, newRatings))
    cy.get('[data-testid=feedback-quality-input]')
      .invoke('val', valueToStep[newRatingValue])
      .trigger('input')

    showsRateValue(connection, newRatings)
    if (newRatingValue === oldRatingValue) {
      submitNewRatingNoChange(connection)
    } else {
      submitNewRatingFailure(connection)
      submitNewRatingSuccess(connection)
    }
    cy.get(`[data-testid=user-v1-${connection.id}-name]`).click()
    showsRateValue(connection, newRatings)
    cy.go(-1)
  }

  it('rates an unrated connection', () => {
    cy.visit(`/community/`)
    cy.get(`[data-testid=user-v1-${unratedConnection.id}-name]`).contains(
      unratedConnection.name
    )
    doRate(unratedConnection)
  })

  it('rates a rated connection', () => {
    cy.visit(`/community/`)
    cy.get(`[data-testid=user-v1-${ratedConnection.id}-name]`).contains(
      ratedConnection.name
    )
    doRate(ratedConnection)
  })

  it('does not send request for an unchanged rate', () => {
    cy.visit(`/community/`)
    cy.get(
      `[data-testid=user-v1-${ratedConnectionWithoutEnergy.id}-name]`
    ).contains(ratedConnectionWithoutEnergy.name)
    doRate(ratedConnectionWithoutEnergy)
  })

  it('can change a negative rate', () => {
    cy.visit(`/community/`)
    cy.get(`[data-testid=user-v1-${ratedConnectionNegative.id}-name]`).contains(
      ratedConnectionNegative.name
    )
    doRate(ratedConnectionNegative)
  })
})
