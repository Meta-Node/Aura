import {AURA_LEVEL, AURA_PROFILE, BRIGHT_ID_BACKUP, FAKE_BRIGHT_ID,} from '../utils/data'
import {AURA_ENERGIES, AURA_INBOUND_ENERGIES} from '../utils/energy'
import {incomingRatings, oldRatings} from '../utils/rating'

describe('Login', () => {
  beforeEach(() => {
    cy.setupProfile()
  })

  it('profile info', () => {
    cy.visit('/')
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
    BRIGHT_ID_BACKUP.userData.name.split(' ').forEach(s => {
      cy.get(`[data-testid=profile-user-name]`).contains(s)
    })
    cy.get(`[data-testid=profile-user-info]`).contains(
      `${AURA_PROFILE.numOfConnections} Connections`
    )
    cy.get('[data-testid=profile-info-aura-level]').contains(AURA_LEVEL)
  })

  it('aura statistics', () => {
    cy.visit('/')
    cy.get('[data-testid=aura-statistics-energy-in]').contains(
      AURA_INBOUND_ENERGIES.energy.length
    )
    cy.get('[data-testid=aura-statistics-energy-out]').contains(
      AURA_ENERGIES.energy.length
    )
    cy.get('[data-testid=aura-statistics-honesty-in]').contains(
      incomingRatings.length
    )
    cy.get('[data-testid=aura-statistics-honesty-out]').contains(
      oldRatings.length
    )
  })
})
