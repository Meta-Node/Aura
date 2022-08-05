import {
  AURA_ENERGIES,
  AURA_INBOUND_ENERGIES,
  FAKE_BRIGHT_ID,
  getEnergyAllocationAmount,
  getEnergyAllocationPercentageString,
  getInboundEnergy,
  getRating,
  oldRatings,
  ratedConnection,
  ratedConnectionNegative,
  ratedConnectionWithoutEnergy,
  ratedMoreThanOrEqualToOneConnections,
  ratingsInEnergyFilterAll,
  ratingsInEnergyFilterAllSortedByRateAscending,
  ratingsInEnergyFilterAllSortedByRateDescending,
  unratedConnection,
} from '../utils/data'
import { ENERGY_TABS, TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'
import { Connection, EnergyAllocation } from '../../types'

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

  function showsConnectionInViewTab(
    connection: Connection,
    allocation: EnergyAllocation
  ) {
    cy.get(`[data-testid^=user-v2-${connection.id}-name]`).contains(
      connection.name
    )
    const rating = getRating(connection.id, oldRatings)
    if (rating) {
      cy.get(`[data-testid^=user-v2-${connection.id}-rating]`).contains(rating)
      cy.get(`[data-testid^=user-v2-${connection.id}-inbound]`).contains(
        getInboundEnergy(connection.id)
      )
      cy.get(`[data-testid^=user-v2-${connection.id}-outbound]`).contains(
        getEnergyAllocationPercentageString(allocation, connection.id)
      )
    } else {
      cy.get(`[data-testid^=user-v2-${connection.id}-rating]`).should(
        'not.exist'
      )
    }
  }

  function checkConnectionOrderInViewTab(brightId: string, index: number) {
    cy.get(`[data-testid=user-v2-${brightId}-name-${index}]`).should('exist')
  }

  function showsConnectionInSetTab(
    connection: Connection,
    allocation: EnergyAllocation
  ) {
    cy.get(`[data-testid=user-v3-${connection.id}-name]`).contains(
      connection.name
    )
    cy.get(`[data-testid=user-v3-${connection.id}-rating]`).contains(
      getRating(connection.id, oldRatings)!
    )
    cy.get(`[data-testid=user-slider-${connection.id}-percentage]`).contains(
      getEnergyAllocationPercentageString(allocation, connection.id)
    )
  }

  it('shows and filters energies', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    // shows rated connections
    ratedMoreThanOrEqualToOneConnections.forEach(c => {
      showsConnectionInViewTab(c, oldEnergyAllocation)
    })

    // does not show unrated or negative rated connections
    cy.get(`[data-testid=user-v2-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    cy.get(`[data-testid=user-v2-${ratedConnectionNegative.id}-name]`).should(
      'not.exist'
    )

    // shows unrated connections when searching, but not negative rated ones
    cy.get('[data-testid=top-search]').type('ra')
    showsConnectionInViewTab(unratedConnection, oldEnergyAllocation)
    cy.get(`[data-testid=user-v2-${ratedConnectionNegative.id}-name]`).should(
      'not.exist'
    )
    cy.get('[data-testid=top-search]').clear()

    // filters based on search value
    cy.get('[data-testid=top-search]').type(unratedConnection.name)
    cy.get(
      `[data-testid=user-v2-${ratedConnectionWithoutEnergy.id}-name]`
    ).should('not.exist')
    cy.get('[data-testid=top-search]').clear()

    // exclude zeros filter
    cy.get(`[data-testid=filter-ExcludeZeros]`).click()
    cy.get(
      `[data-testid=user-v2-${ratedConnectionWithoutEnergy.id}-name]`
    ).should('not.exist')
  })

  it('orders energies', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    // sorting by rate should change the order for the test to be valid
    expect(ratingsInEnergyFilterAllSortedByRateAscending).to.not.deep.equal(
      ratingsInEnergyFilterAll
    )
    expect(ratingsInEnergyFilterAllSortedByRateDescending).to.not.deep.equal(
      ratingsInEnergyFilterAll
    )

    ratingsInEnergyFilterAll.forEach((r, i) => {
      checkConnectionOrderInViewTab(r.toBrightId, i)
    })

    cy.get('[data-testid=filter-Rated]').click()
    ratingsInEnergyFilterAllSortedByRateDescending.forEach((r, i) => {
      checkConnectionOrderInViewTab(r.toBrightId, i)
    })

    cy.get('[data-testid=filter-Rated]').click()
    ratingsInEnergyFilterAllSortedByRateAscending.forEach((r, i) => {
      checkConnectionOrderInViewTab(r.toBrightId, i)
    })
  })

  it('can update energies', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.SET}`)
    cy.get(`[data-testid=user-v3-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    showsConnectionInSetTab(ratedConnection, oldEnergyAllocation)
    showsConnectionInSetTab(ratedConnectionWithoutEnergy, oldEnergyAllocation)
    cy.get(`[data-testid=user-slider-${ratedConnectionWithoutEnergy.id}-input]`)
      .should('have.value', 0)
      .clear()
      .type(
        getEnergyAllocationAmount(
          newEnergyAllocation,
          ratedConnectionWithoutEnergy.id
        )
      )
    cy.get(`[data-testid=user-slider-${ratedConnection.id}-input]`)
      .should(
        'have.value',
        getEnergyAllocationAmount(oldEnergyAllocation, ratedConnection.id)
      )
      .clear()
      .type(getEnergyAllocationAmount(newEnergyAllocation, ratedConnection.id))
    showsConnectionInSetTab(ratedConnection, newEnergyAllocation)
    showsConnectionInSetTab(ratedConnectionWithoutEnergy, newEnergyAllocation)
    submitEnergyFailure()
    submitEnergySuccess()
    cy.get('[data-testid=energy-tab-switch-view]').click()
    showsConnectionInViewTab(ratedConnection, newEnergyAllocation)
    showsConnectionInViewTab(ratedConnectionWithoutEnergy, newEnergyAllocation)
  })
})
