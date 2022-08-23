import {
  FAKE_BRIGHT_ID,
  ratedConnection,
  ratedConnectionNegative,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from '../utils/data'
import { ENERGY_TABS, TOAST_ERROR, TOAST_SUCCESS } from '../../utils/constants'
import {
  Connection,
  EnergyAllocationList,
  EnergyAllocationRetrieveResponse,
  EnergyAllocationUpdateResponse,
  InboundEnergyAllocationRetrieveResponse,
} from '../../types'
import {
  AURA_ENERGIES,
  AURA_INBOUND_ENERGIES,
  connectionsInEnergyFilterAll,
  connectionsInEnergyFilterAllSortedByRateAscending,
  connectionsInEnergyFilterAllSortedByRateDescending,
  connectionsInEnergyFilterAllSortedByRecentAscending,
  connectionsInEnergyFilterAllSortedByRecentDescending,
  connectionsInEnergyFilterExcludeZero,
  connectionsInEnergyFilterExcludeZeroSortedByRateAscending,
  connectionsInEnergyFilterExcludeZeroSortedByRateDescending,
  getEnergyAllocationAmount,
  getEnergyAllocationPercentageStringInSet,
  getEnergyAllocationPercentageStringInView,
  getInboundEnergyPercentage,
  newEnergyAllocation,
  oldEnergyAllocation,
} from '../utils/energy'
import { getRating, oldRatings } from '../utils/rating'

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
    const retrieveResponse: EnergyAllocationRetrieveResponse = AURA_ENERGIES
    cy.intercept(
      {
        url: `/v1/energy/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: retrieveResponse,
      }
    )
    const inboundEnergyResponse: InboundEnergyAllocationRetrieveResponse =
      AURA_INBOUND_ENERGIES
    cy.intercept(
      {
        url: `/v1/energy/inbound/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: inboundEnergyResponse,
      }
    )
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

  it('shows energies in the view tab', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    // shows rated connections
    connectionsInEnergyFilterAll.forEach(c => {
      showsConnectionInViewTab(c, oldEnergyAllocation)
    })

    // does not show unrated or negative rated connections
    cy.get(`[data-testid^=user-item-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    cy.get(
      `[data-testid^=user-item-${ratedConnectionNegative.id}-name]`
    ).should('not.exist')
  })

  it('can search connections', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    // shows unrated connections when searching, but not negative rated ones
    cy.get('[data-testid=top-search]').type('ra')
    showsConnectionInViewTab(unratedConnection, oldEnergyAllocation)
    cy.get(
      `[data-testid^=user-item-${ratedConnectionNegative.id}-name]`
    ).should('not.exist')
    cy.get('[data-testid=top-search]').clear()

    // filters based on search value
    cy.get('[data-testid=top-search]').type(unratedConnection.name)
    cy.get(
      `[data-testid^=user-item-${ratedConnectionWithoutEnergy.id}-name]`
    ).should('not.exist')
    cy.get('[data-testid=top-search]').clear()
  })

  function checkConnectionOrderInViewTab(brightId: string, index: number) {
    cy.get(`[data-testid=user-item-${brightId}-name-${index}]`).should('exist')
  }

  function assertOrder(orderedConnections: Connection[]) {
    orderedConnections.forEach((r, i) => {
      checkConnectionOrderInViewTab(r.id, i)
    })
  }

  it('orders connections by rate', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    // sorting by rate should change the order for the test to be valid
    expect(connectionsInEnergyFilterAllSortedByRateAscending).to.not.deep.equal(
      connectionsInEnergyFilterAll
    )
    expect(
      connectionsInEnergyFilterAllSortedByRateDescending
    ).to.not.deep.equal(connectionsInEnergyFilterAll)

    assertOrder(connectionsInEnergyFilterAll)

    cy.get('[data-testid=filter-Rated-inactive]').click()
    assertOrder(connectionsInEnergyFilterAllSortedByRateDescending)

    cy.get('[data-testid=filter-Rated-descending]').click()
    assertOrder(connectionsInEnergyFilterAllSortedByRateAscending)

    cy.get('[data-testid=filter-Rated-ascending]').should('exist')
  })

  it('orders connections by rate', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    // sorting by rate should change the order for the test to be valid
    expect(
      connectionsInEnergyFilterAllSortedByRecentAscending
    ).to.not.deep.equal(connectionsInEnergyFilterAll)
    expect(
      connectionsInEnergyFilterAllSortedByRecentDescending
    ).to.not.deep.equal(connectionsInEnergyFilterAll)

    assertOrder(connectionsInEnergyFilterAll)

    cy.get('[data-testid=filter-Recent-inactive]').click()
    assertOrder(connectionsInEnergyFilterAllSortedByRecentDescending)

    cy.get('[data-testid=filter-Recent-descending]').click()
    assertOrder(connectionsInEnergyFilterAllSortedByRecentAscending)

    cy.get('[data-testid=filter-Recent-ascending]').should('exist')
  })

  function assertExcludeZerosFilter(isApplied: boolean) {
    cy.get(
      `[data-testid^=user-item-${ratedConnectionWithoutEnergy.id}-name]`
    ).should(isApplied ? 'not.exist' : 'exist')
  }

  it('exclude zeros filter', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)
    assertExcludeZerosFilter(false)
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).click()
    assertExcludeZerosFilter(true)
    cy.get(`[data-testid=filter-ExcludeZeros-active]`).click()
    assertExcludeZerosFilter(false)
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).should('exist')
  })

  it('can order filtered list', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    expect(connectionsInEnergyFilterAll).to.not.deep.equal(
      connectionsInEnergyFilterExcludeZero
    )
    // sorting by rate should change the order for the test to be valid
    expect(
      connectionsInEnergyFilterExcludeZeroSortedByRateAscending
    ).to.not.deep.equal(connectionsInEnergyFilterExcludeZero)
    expect(
      connectionsInEnergyFilterExcludeZeroSortedByRateDescending
    ).to.not.deep.equal(connectionsInEnergyFilterExcludeZero)

    // filter
    assertExcludeZerosFilter(false)
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).click()
    assertExcludeZerosFilter(true)
    cy.get(`[data-testid=filter-ExcludeZeros-active]`).should('exist')

    // order
    assertOrder(connectionsInEnergyFilterExcludeZero)

    cy.get('[data-testid=filter-Rated-inactive]').click()
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateDescending)

    cy.get('[data-testid=filter-Rated-descending]').click()
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateAscending)

    cy.get('[data-testid=filter-Rated-ascending]').should('exist')
  })

  it('can filter ordered list', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)

    expect(connectionsInEnergyFilterAll).to.not.deep.equal(
      connectionsInEnergyFilterAllSortedByRateAscending
    )
    expect(connectionsInEnergyFilterAllSortedByRateAscending).to.not.deep.equal(
      connectionsInEnergyFilterExcludeZeroSortedByRateAscending
    )

    // order
    cy.get('[data-testid=filter-Rated-inactive]').click()
    assertOrder(connectionsInEnergyFilterAllSortedByRateDescending)

    // filter
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).click()
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateDescending)
    cy.get('[data-testid=filter-Rated-descending]').should('exist')
    cy.get('[data-testid=filter-ExcludeZeros-active]').should('exist')
  })

  it('keeps filters when navigating', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)
    assertOrder(connectionsInEnergyFilterAll)

    expect(connectionsInEnergyFilterAll).to.not.deep.equal(
      connectionsInEnergyFilterExcludeZeroSortedByRateAscending
    )

    cy.get('[data-testid=filter-Rated-inactive]').click()
    cy.get(`[data-testid=filter-Rated-descending]`).click()
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).click()
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateAscending)

    cy.get(`[data-testid^=user-item-${ratedConnection.id}-name]`).click()
    cy.go(-1)

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateAscending)
  })

  it('keeps filters after reload', () => {
    cy.visit(`/energy/?tab=${ENERGY_TABS.VIEW}`)
    assertOrder(connectionsInEnergyFilterAll)

    expect(connectionsInEnergyFilterAll).to.not.deep.equal(
      connectionsInEnergyFilterExcludeZeroSortedByRateAscending
    )

    cy.get('[data-testid=filter-Rated-inactive]').click()
    cy.get(`[data-testid=filter-Rated-descending]`).click()
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).click()
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateAscending)

    cy.reload()
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateAscending)
  })

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
