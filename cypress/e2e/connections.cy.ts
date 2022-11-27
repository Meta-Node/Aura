import {Connection} from '../../types'
import {
  connectionsInConnectionsPageFilterAll,
  connectionsInConnectionsPageFilterAllSortedByNameAscending,
  connectionsInConnectionsPageFilterAllSortedByNameDescending,
  connectionsInConnectionsPageJustMet,
  connectionsInConnectionsPageJustMetSortedByNameAscending,
  connectionsInConnectionsPageJustMetSortedByNameDescending,
} from '../utils/rating'

describe('Connections Page', () => {
  beforeEach(() => {
    cy.setupProfile()
  })

  function checkConnectionOrderInViewTab(brightId: string, index: number) {
    cy.get(`[data-testid=user-item-${brightId}-name-${index}]`).should('be.visible')
  }

  function assertOrder(orderedConnections: Connection[]) {
    orderedConnections.forEach((r, i) => {
      checkConnectionOrderInViewTab(r.id, i)
    })
    cy.get(`[data-testid=user-item-${orderedConnections.length}]`).should(
      'not.be.visible'
    )
  }

  it('filters and sorts connections', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInConnectionsPageFilterAll)

    expect(connectionsInConnectionsPageFilterAll).to.not.deep.equal(
      connectionsInConnectionsPageJustMet
    )

    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    assertOrder(connectionsInConnectionsPageJustMet)
  })

  it('sorts connections', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInConnectionsPageFilterAll)

    expect(connectionsInConnectionsPageFilterAll).to.not.deep.equal(
      connectionsInConnectionsPageFilterAllSortedByNameAscending
    )
    expect(connectionsInConnectionsPageFilterAll).to.not.deep.equal(
      connectionsInConnectionsPageFilterAllSortedByNameDescending
    )

    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInConnectionsPageFilterAllSortedByNameAscending)

    cy.get('[data-testid=filter-Name-ascending').click()
    assertOrder(connectionsInConnectionsPageFilterAllSortedByNameDescending)

    cy.get('[data-testid=filter-Name-descending').should('exist')
  })

  it('orders filtered list', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInConnectionsPageFilterAll)

    expect(connectionsInConnectionsPageFilterAll).to.not.deep.equal(
      connectionsInConnectionsPageJustMet
    )
    expect(connectionsInConnectionsPageJustMet).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByNameAscending
    )
    expect(connectionsInConnectionsPageJustMet).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByNameDescending
    )

    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    assertOrder(connectionsInConnectionsPageJustMet)

    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInConnectionsPageJustMetSortedByNameAscending)

    cy.get('[data-testid=filter-Name-ascending').click()
    assertOrder(connectionsInConnectionsPageJustMetSortedByNameDescending)

    cy.get('[data-testid=filter-Name-descending').should('exist')
  })

  it('filters ordered list', () => {
    cy.visit(`/connections/`)
    assertOrder(connectionsInConnectionsPageFilterAll)

    expect(connectionsInConnectionsPageFilterAll).to.not.deep.equal(
      connectionsInConnectionsPageFilterAllSortedByNameAscending
    )
    expect(
      connectionsInConnectionsPageFilterAllSortedByNameAscending
    ).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByNameAscending
    )

    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInConnectionsPageFilterAllSortedByNameAscending)

    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    assertOrder(connectionsInConnectionsPageJustMetSortedByNameAscending)

    cy.get('[data-testid=filter-Name-ascending').should('exist')
  })

  it('keeps filters when navigating', () => {
    cy.visit(`/connections/`)
    expect(connectionsInConnectionsPageFilterAll).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByNameAscending
    )

    assertOrder(connectionsInConnectionsPageFilterAll)
    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInConnectionsPageJustMetSortedByNameAscending)

    // navigate to another page
    cy.visit('/contact-us/')
    cy.go(-1)

    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)
    assertOrder(connectionsInConnectionsPageJustMetSortedByNameAscending)
  })

  it('keeps filters after reload', () => {
    cy.visit(`/connections/`)
    expect(connectionsInConnectionsPageFilterAll).to.not.deep.equal(
      connectionsInConnectionsPageJustMetSortedByNameAscending
    )

    assertOrder(connectionsInConnectionsPageFilterAll)
    cy.get('[data-testid=custom-select]').click()
    cy.get('[data-testid=custom-select-option-Justmet]').click()
    cy.get('[data-testid=filter-Name-inactive').click()
    assertOrder(connectionsInConnectionsPageJustMetSortedByNameAscending)

    cy.reload()
    assertOrder(connectionsInConnectionsPageJustMetSortedByNameAscending)
  })
})
