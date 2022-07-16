import {
  AURA_CONNECTIONS,
  AURA_ENERGIES,
  AURA_INBOUND_ENERGIES,
  FAKE_BRIGHT_ID,
  getInboundEnergy,
  getOutboundEnergy,
  getRating,
  ratedConnection,
  unratedConnection,
} from '../utils/data'
import { CONNECTION_SEARCH_SEED } from '../../utils/constants'

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

  it('shows energies', () => {
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
      getOutboundEnergy(ratedConnection.id)
    )
  })
})
