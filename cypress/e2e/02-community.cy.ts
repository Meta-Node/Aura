import {
  AURA_GENERAL_PROFILE,
  BRIGHT_ID_BACKUP,
  FAKE_BRIGHT_ID,
  getConnectionResponse,
  getRating,
  newRatings,
  oldRatings,
  ratedConnection,
} from '../utils/data'
import { AuraRating, Connection } from '../types'
import { getStepName, valueToStep } from '../../utils/rating'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'

describe('Energy', () => {
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

  const currentRatings = Object.assign([], oldRatings)

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

  //
  function submitNewRatingSuccess(connection: Connection) {
    //   cy.intercept(
    //     {
    //       url: `/v1/energy/${FAKE_BRIGHT_ID}`,
    //       method: 'POST',
    //     },
    //     {
    //       body: { energyAllocation: newEnergyAllocation },
    //       statusCode: 200,
    //     }
    //   ).as('submitEnergy')
    //   cy.intercept(
    //     {
    //       url: `/v1/energy/${FAKE_BRIGHT_ID}`,
    //       method: 'GET',
    //     },
    //     {
    //       body: { energy: newEnergyAllocation },
    //     }
    //   )
    //
    //   cy.get('[data-testid=update-energy]').click()
    //   cy.wait('@submitEnergy')
    //     .its('request.body')
    //     .should(body => {
    //       expect(body).to.have.key('encryptedTransfers')
    //     })
    cy.get(`.toast--${TOAST_SUCCESS}`)
  }

  function showsRateValue(connection: Connection, ratings: AuraRating[]) {
    const ratingValue = Number(getRating(connection.id, ratings))
    cy.get('[data-testid=feedback-quality-value]').contains(
      getStepName(ratingValue)
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
        body: getConnectionResponse(connection),
      }
    )
    cy.get(`[data-testid=user-v1-${connection.id}-name]`).click()
    showsRateValue(connection, oldRatings)

    // set new rating value
    const newRatingValue = Number(getRating(connection.id, newRatings))
    cy.get('[data-testid=feedback-quality-input]')
      .invoke('val', valueToStep[newRatingValue])
      .trigger('input')

    showsRateValue(connection, newRatings)

    submitNewRatingFailure(connection)
  }

  it('do rate', () => {
    cy.visit(`/community/`)
    BRIGHT_ID_BACKUP.connections.forEach(connection => {
      cy.get(`[data-testid=user-v1-${connection.id}-name]`).contains(
        connection.name
      )
    })
    doRate(ratedConnection)
  })
})
