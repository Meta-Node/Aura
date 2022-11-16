import {
  AURA_GENERAL_PROFILE,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_BRIGHT_ID_PASSWORD,
  ratedConnection,
  ratedConnectionNegative,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from '../utils/data'
import { AuraRating, AuraRatingRetrieveResponse, Connection } from '../../types'
import { getStepName, valueToStep } from '../../utils/rating'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'
import { getConnectionResponse } from '../utils/energy'
import { getRating, newRatings, oldRatings } from '../utils/rating'

describe('Rating', () => {
  beforeEach(() => {
    cy.setupProfile()
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

  function ratePageIntercepts(connection: Connection) {
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
  }

  function setNewRateValue(connection: Connection) {
    const newRatingValue = Number(getRating(connection.id, newRatings))
    cy.get('[data-testid=feedback-quality-input]')
      .invoke('val', valueToStep[newRatingValue])
      .trigger('input')
  }

  function submitNewRatingNoChange(connection: Connection) {
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}/${connection.id}`,
        method: 'POST',
      },
      {
        statusCode: 200,
      }
    ).as('submitRatingError')
    setNewRating(connection)

    cy.get('[data-testid=feedback-quality-confirm]').click()
    // should not be called
    cy.get('@submitRatingError.all').should('have.length', 0)
    cy.url().should('include', `/connections`)
  }

  function doRate(connection: Connection) {
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
      cy.get(`[data-testid^=user-item-${connection.id}-name]`).click()
      showsRateValue(connection, newRatings)
      cy.go(-1)
    }
  }

  it('visits profile from connections and rates an unrated connection', () => {
    ratePageIntercepts(unratedConnection)
    cy.visit(`/connections/`)
    cy.get(`[data-testid^=user-item-${unratedConnection.id}-name]`).click()
    showsRateValue(unratedConnection, oldRatings)
    doRate(unratedConnection)
  })

  it('rates a rated connection', () => {
    ratePageIntercepts(ratedConnection)
    cy.visit(`/profile/` + ratedConnection.id)
    showsRateValue(ratedConnection, oldRatings)
    doRate(ratedConnection)
  })

  it('does not send request for an unchanged rate', () => {
    const oldRatingValue = Number(
      getRating(ratedConnectionWithoutEnergy.id, oldRatings)
    )
    const newRatingValue = Number(
      getRating(ratedConnectionWithoutEnergy.id, newRatings)
    )
    assert(oldRatingValue === newRatingValue)
    ratePageIntercepts(ratedConnectionWithoutEnergy)
    cy.visit(`/profile/` + ratedConnectionWithoutEnergy.id)
    showsRateValue(ratedConnectionWithoutEnergy, oldRatings)
    doRate(ratedConnectionWithoutEnergy)
  })

  it('can change a negative rate', () => {
    ratePageIntercepts(ratedConnectionNegative)
    cy.visit(`/profile/` + ratedConnectionNegative.id)
    showsRateValue(ratedConnectionNegative, oldRatings)
    doRate(ratedConnectionNegative)
  })

  it('regenerates keypair if the user if the privateKey is invalid', () => {
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        body: 'OK',
      }
    ).as('explorerCode')
    let publicKey1: string | null
    let privateKey1: string | null
    ratePageIntercepts(unratedConnection)
    cy.visit(`/profile/` + unratedConnection.id).then(() => {
      publicKey1 = window.localStorage.getItem('publicKey')
      privateKey1 = window.localStorage.getItem('privateKey')
    })
    showsRateValue(unratedConnection, oldRatings)
    setNewRateValue(unratedConnection)

    let firstTime = true
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}/${unratedConnection.id}`,
        method: 'POST',
      },
      req => {
        if (firstTime) {
          firstTime = false
          req.reply({
            statusCode: 500,
            body: `Could not decrypt using publicKey: ${FAKE_BRIGHT_ID}`,
          })
        } else {
          req.reply({
            statusCode: 200,
          })
        }
      }
    ).as('submitRatingEncryptErrorFirstTime')
    cy.get('[data-testid=feedback-quality-confirm]').click()

    cy.wait('@explorerCode')
      .its('request.body')
      .should(body => {
        expect(body.brightId).to.eq(FAKE_BRIGHT_ID)
        expect(body.password).to.eq(FAKE_BRIGHT_ID_PASSWORD)
        expect(body.key).to.eq(FAKE_AUTH_KEY)
        expect(body.publicKey).to.be.not.null
      })
      .then(() => {
        expect(window.localStorage.getItem('publicKey')).to.not.eq(publicKey1)
        expect(window.localStorage.getItem('privateKey')).to.not.eq(privateKey1)
      })
    cy.get(`.toast--${TOAST_SUCCESS}`).should('exist')
    cy.get('@submitRatingEncryptErrorFirstTime.all').should('have.length', 2)
  })
})
