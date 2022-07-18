import {
  AURA_CONNECTIONS,
  AURA_ENERGIES,
  AURA_INBOUND_ENERGIES,
  EnergyAllocation,
  FAKE_BRIGHT_ID,
  getInboundEnergy,
  getOutboundEnergy,
  getRating,
  ratedConnection,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from '../utils/data'
import {
  CONNECTION_SEARCH_SEED,
  TOAST_ERROR,
  TOAST_SUCCESS,
} from '../../utils/constants'

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
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: AURA_ENERGIES,
      }
    )
    cy.intercept(
      {
        url: `/v1/energy/inbound/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: AURA_INBOUND_ENERGIES,
      }
    )
    cy.intercept(
      {
        url: `/v1/connections/search?fromBrightId=${FAKE_BRIGHT_ID}&seed=${CONNECTION_SEARCH_SEED}`,
        method: 'GET',
      },
      {
        body: AURA_CONNECTIONS,
      }
    )
  })

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  const oldEnergyAllocation: EnergyAllocation = AURA_ENERGIES.energy
  const newEnergyAllocation: EnergyAllocation = [
    {
      amount: 100,
      toBrightId: ratedConnectionWithoutEnergy.id,
    },
    {
      amount: 5,
      toBrightId: ratedConnection.id,
    },
  ]

  function getEnergyAllocationAmount(
    allocation: EnergyAllocation,
    brightId: string
  ) {
    return String(allocation.find(e => e.toBrightId === brightId)?.amount)
  }

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
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'POST',
      },
      {
        body: { energyAllocation: newEnergyAllocation },
        statusCode: 200,
      }
    ).as('submitEnergy')
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: { energy: newEnergyAllocation },
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

  function showsEnergies(allocation: EnergyAllocation) {
    cy.visit('/energy/?tab=Explorer&filter=All')
    cy.get(`[data-testid=user-v2-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    cy.get(`[data-testid=user-v2-${ratedConnection.id}-name]`).contains(
      ratedConnection.name
    )
    cy.get(`[data-testid=user-v2-${ratedConnection.id}-rating]`).contains(
      getRating(ratedConnection.id)
    )
    cy.get(`[data-testid=user-v2-${ratedConnection.id}-inbound]`).contains(
      getInboundEnergy(ratedConnection.id)
    )
    cy.get(`[data-testid=user-v2-${ratedConnection.id}-outbound]`).contains(
      getEnergyAllocationAmount(allocation, ratedConnection.id)
    )
  }

  it('shows energies', () => {
    showsEnergies(oldEnergyAllocation)
  })

  it('can submit energies', () => {
    cy.visit('/energy/?tab=Energy&filter=All')
    cy.get(`[data-testid=user-v3-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    cy.get(`[data-testid=user-v3-${ratedConnection.id}-name]`).contains(
      ratedConnection.name
    )
    cy.get(`[data-testid=user-v3-${ratedConnection.id}-rating]`).contains(
      getRating(ratedConnection.id)
    )
    cy.get(
      `[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`
    ).type(
      getEnergyAllocationAmount(
        newEnergyAllocation,
        ratedConnectionWithoutEnergy.id
      )
    )
    cy.get(`[data-testid=user-slider-${ratedConnection.id}-input]`)
      .invoke('val')
      .then(val => {
        expect(val).to.equal(String(getOutboundEnergy(ratedConnection.id)))

        cy.get(`[data-testid=user-slider-${ratedConnection.id}-input]`)
          .clear()
          .type(
            getEnergyAllocationAmount(newEnergyAllocation, ratedConnection.id)
          )
        submitEnergyFailure()
        submitEnergySuccess()
        showsEnergies(newEnergyAllocation)
      })
  })
})
