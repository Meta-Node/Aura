import {
  FAKE_BRIGHT_ID,
  ratedConnection,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from '../utils/data'
import { ENERGY_TABS, TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'
import {
  Connection,
  EnergyAllocationList,
  EnergyAllocationRetrieveResponse,
  EnergyAllocationUpdateResponse,
} from '../../types'
import {
  getEnergyAllocationAmount,
  getEnergyAllocationPercentageStringInSet,
  getEnergyAllocationPercentageStringInView,
  getInboundEnergyPercentage,
  newEnergyAllocation,
  oldEnergyAllocation,
} from '../utils/energy'
import { getRating, oldRatings } from '../utils/rating'

describe('Energy Set', () => {
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

  function submitEnergySuccess() {
    const updateResponse: EnergyAllocationUpdateResponse = {
      energyAllocation: newEnergyAllocation,
    }
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

  function showsConnectionInViewTab(
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
      cy.get(`[data-testid^=user-v2-${connection.id}-inbound]`).contains(
        getInboundEnergyPercentage(connection.id)
      )
      cy.get(`[data-testid^=user-v2-${connection.id}-outbound]`).contains(
        getEnergyAllocationPercentageStringInView(allocation, connection.id)
      )
    } else {
      cy.get(`[data-testid^=user-item-${connection.id}-rating]`).should(
        'not.exist'
      )
    }
  }

  function showsConnectionInSetTab(
    connection: Connection,
    allocation: EnergyAllocationList
  ) {
    cy.get(`[data-testid^=user-item-${connection.id}-name]`).contains(
      connection.name
    )
    cy.get(`[data-testid^=user-item-${connection.id}-rating]`).contains(
      getRating(connection.id, oldRatings)!
    )
    cy.get(`[data-testid=user-slider-${connection.id}-input]`).should(
      'have.value',
      getEnergyAllocationAmount(allocation, connection.id)
    )
    cy.get(`[data-testid=user-slider-${connection.id}-percentage]`).should(
      'have.text',
      getEnergyAllocationPercentageStringInSet(allocation, connection.id)
    )
  }

  it('shows energies in set tab', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.SET}`)
    cy.get(`[data-testid^=user-item-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    showsConnectionInSetTab(ratedConnection, oldEnergyAllocation)
    showsConnectionInSetTab(ratedConnectionWithoutEnergy, oldEnergyAllocation)
  })

  it('can not set value more than 100 or less than 0', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.SET}`)
    cy.get(`[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`)
      .type('{selectAll}')
      .type('9999999')
      .should('have.value', 100)

    cy.get(`[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`)
      .type('{selectAll}')
      .type('50')
      .type('{moveToStart}')
      .type('-')
      .should('have.value', 0)
  })

  it('can update energies', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.SET}`)
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

    showsConnectionInSetTab(ratedConnection, newEnergyAllocation)
    showsConnectionInSetTab(ratedConnectionWithoutEnergy, newEnergyAllocation)
    submitEnergyFailure()
    submitEnergySuccess()
    cy.get('[data-testid=energy-tab-switch-view]').click()
    showsConnectionInViewTab(ratedConnection, newEnergyAllocation)
    showsConnectionInViewTab(ratedConnectionWithoutEnergy, newEnergyAllocation)
  })

  function submitEnergyEncryptFailure() {
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'POST',
      },
      {
        statusCode: 500,
        body: `Could not decrypt using publicKey: ${FAKE_BRIGHT_ID}`,
      }
    ).as('submitEnergyEncryptError')
    cy.get('[data-testid=update-energy]').click()
    cy.wait('@submitEnergyEncryptError')
    cy.get(`.toast--${TOAST_ERROR}`)
    cy.url().should('not.include', 'energy')
  }

  it('logs out the user if the privateKey is invalid', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.SET}`)
    cy.get(`[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`)
      .type('{selectAll}')
      .type(
        getEnergyAllocationAmount(
          newEnergyAllocation,
          ratedConnectionWithoutEnergy.id
        )
      )

    submitEnergyEncryptFailure()
  })
})
