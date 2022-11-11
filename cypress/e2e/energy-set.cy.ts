import {
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_BRIGHT_ID_PASSWORD,
  ratedConnection,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from '../utils/data'
import { TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'
import {
  Connection,
  EnergyAllocationList,
  EnergyAllocationRetrieveResponse,
  EnergyAllocationUpdateResponse,
} from '../../types'
import {
  getEnergyAllocationAmount,
  getEnergyAllocationPercentageStringInSet,
  getInboundEnergyAmount,
  getInboundEnergyPercentage,
  newEnergyAllocation,
  oldEnergyAllocation,
} from '../utils/energy'
import { getRating, oldRatings } from '../utils/rating'

describe('Energy Set', () => {
  beforeEach(() => {
    cy.setupProfile()
  })

  function submitEnergyFailure() {
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'POST',
      },
      {
        statusCode: 500,
      }
    ).as('submitEnergyError')
    cy.get('[data-testid=update-energy]').click()
    cy.wait('@submitEnergyError')
    cy.get(`.toast--${TOAST_ERROR}`)
  }

  const updateResponse: EnergyAllocationUpdateResponse = {
    energyAllocation: newEnergyAllocation,
  }

  function submitEnergySuccess() {
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'POST',
      },
      {
        body: updateResponse,
        statusCode: 200,
      }
    ).as('submitEnergy')
    const retrieveResponse: EnergyAllocationRetrieveResponse = {
      energy: newEnergyAllocation,
    }
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: retrieveResponse,
      }
    )

    cy.get('[data-testid=update-energy]').click()
    cy.wait('@submitEnergy')
      .its('request.body')
      .should(body => {
        expect(body).to.have.key('encryptedTransfers')
      })
    cy.get(`.toast--${TOAST_SUCCESS}`)
  }

  function showsConnectionInEnergyPage(
    connection: Connection,
    allocation: EnergyAllocationList
  ) {
    cy.get(`[data-testid^=user-item-${connection.id}-name]`).contains(
      connection.name
    )
    const rating = getRating(connection.id, oldRatings)
    if (rating) {
      cy.get(`[data-testid^=user-item-${connection.id}-rating]`).contains(
        rating
      )
      cy.get(`[data-testid^=user-v3-${connection.id}-inbound]`).contains(
        getInboundEnergyAmount(connection.id)
      )
      cy.get(
        `[data-testid^=user-v3-${connection.id}-inbound-percentage]`
      ).contains(getInboundEnergyPercentage(connection.id))
      cy.get(`[data-testid=user-slider-${connection.id}-input]`).should(
        'have.value',
        getEnergyAllocationAmount(allocation, connection.id)
      )
      cy.get(`[data-testid=user-slider-${connection.id}-percentage]`).should(
        'have.text',
        getEnergyAllocationPercentageStringInSet(allocation, connection.id)
      )
    } else {
      cy.get(`[data-testid^=user-item-${connection.id}-rating]`).should(
        'not.exist'
      )
    }
  }

  it('shows energies in set tab', () => {
    cy.visit('/energy/')
    cy.get(`[data-testid^=user-item-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    showsConnectionInEnergyPage(ratedConnection, oldEnergyAllocation)
    showsConnectionInEnergyPage(
      ratedConnectionWithoutEnergy,
      oldEnergyAllocation
    )
  })

  it('can not set value more less than 0', () => {
    cy.visit('/energy/')

    cy.get(`[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`)
      .type('{selectAll}')
      .type('50')
      .type('{moveToStart}')
      .type('-')
      .should('have.value', 0)
  })

  it('can update energies', () => {
    cy.visit('/energy/')
    cy.get(`[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`)
      .type('{selectAll}')
      .type(
        getEnergyAllocationAmount(
          newEnergyAllocation,
          ratedConnectionWithoutEnergy.id
        )
      )

    cy.get(`[data-testid=user-slider-${ratedConnection.id}-input]`)
      .type('{selectAll}')
      .type(getEnergyAllocationAmount(newEnergyAllocation, ratedConnection.id))

    showsConnectionInEnergyPage(ratedConnection, newEnergyAllocation)
    showsConnectionInEnergyPage(
      ratedConnectionWithoutEnergy,
      newEnergyAllocation
    )
    submitEnergyFailure()
    submitEnergySuccess()
  })

  it('regenerates keypair if the privateKey is invalid', () => {
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
    cy.visit('/energy/').then(() => {
      publicKey1 = window.localStorage.getItem('publicKey')
      privateKey1 = window.localStorage.getItem('privateKey')
    })
    cy.get(`[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`)
      .type('{selectAll}')
      .type(
        getEnergyAllocationAmount(
          newEnergyAllocation,
          ratedConnectionWithoutEnergy.id
        )
      )

    let firstTime = true
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
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
            body: updateResponse,
            statusCode: 200,
          })
        }
      }
    ).as('submitEnergyEncryptError')
    cy.get('[data-testid=update-energy]').click()

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
    cy.get('@submitEnergyEncryptError.all').should('have.length', 2)
  })
})
