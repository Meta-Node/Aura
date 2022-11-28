import {ratedConnectionNegative, ratedConnectionWithoutEnergy, unratedConnection,} from '../utils/data'
import {Connection, EnergyAllocationList} from '../../types'
import {
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
  getInboundEnergyPercentage,
  oldEnergyAllocation,
} from '../utils/energy'
import {getRating, oldRatings} from '../utils/rating'

describe('Energy View', () => {
  beforeEach(() => {
    cy.setupProfile()
  })

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

  it('shows energies in the energy page', () => {
    cy.visit('/energy/')

    // shows rated connections
    connectionsInEnergyFilterAll.forEach(c => {
      showsConnectionInEnergyPage(c, oldEnergyAllocation)
    })

    // does not show unrated or negative rated connections
    cy.get(`[data-testid^=user-item-${unratedConnection.id}-name]`).should(
      'not.exist'
    )
    cy.get(
      `[data-testid^=user-item-${ratedConnectionNegative.id}-name]`
    ).should('not.exist')
  })

  it('shows unrated connections when searching, but not negative rated ones', () => {
    cy.visit('/energy/')

    cy.get('[data-testid=top-search]').type('ra')
    showsConnectionInEnergyPage(unratedConnection, oldEnergyAllocation)
    cy.get(
      `[data-testid^=user-item-${ratedConnectionNegative.id}-name]`
    ).should('not.exist')
  })

  it('filters based on search value', () => {
    cy.visit('/energy/')

    cy.get('[data-testid=top-search]').type(unratedConnection.name)
    cy.get(
      `[data-testid^=user-item-${ratedConnectionWithoutEnergy.id}-name]`
    ).should('not.exist')
  })

  function checkConnectionOrderInViewTab(brightId: string, index: number) {
    cy.get(`[data-testid=user-item-${brightId}-name-${index}]`).should('be.visible')
  }

  function assertOrder(orderedConnections: Connection[]) {
    orderedConnections.forEach((r, i) => {
      checkConnectionOrderInViewTab(r.id, i)
    })
    cy.get(`[data-testid=user-item-${orderedConnections.length}]`).should(
      'not.exist'
    )
  }

  it('orders connections by rate', () => {
    cy.visit('/energy/')

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
    cy.visit('/energy/')

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
    cy.visit('/energy/')
    assertExcludeZerosFilter(false)
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).click()
    assertExcludeZerosFilter(true)
    cy.get(`[data-testid=filter-ExcludeZeros-active]`).click()
    assertExcludeZerosFilter(false)
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).should('exist')
  })

  it('can order filtered list', () => {
    cy.visit('/energy/')

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
    cy.visit('/energy/')

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
    cy.visit('/energy/')
    assertOrder(connectionsInEnergyFilterAll)

    expect(connectionsInEnergyFilterAll).to.not.deep.equal(
      connectionsInEnergyFilterExcludeZeroSortedByRateAscending
    )

    cy.get('[data-testid=filter-Rated-inactive]').click()
    cy.get(`[data-testid=filter-Rated-descending]`).click()
    cy.get(`[data-testid=filter-ExcludeZeros-inactive]`).click()
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateAscending)

    // navigate to another page
    cy.visit('/contact-us/')
    cy.go(-1)

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)
    assertOrder(connectionsInEnergyFilterExcludeZeroSortedByRateAscending)
  })

  it('keeps filters after reload', () => {
    cy.visit('/energy/')
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
})
