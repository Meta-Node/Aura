import { FAKE_BRIGHT_ID } from '../utils/data'
import { TOAST_SUCCESS } from '../../utils/constants'

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

  it('can update energies', () => {
    const contactMessage = {
      category: 'Question',
      text: 'Sample contact message',
    }
    cy.visit(`/contact-us/`)
    cy.get(`[data-testid=contact-us-category]`).click()
    cy.get(
      `[data-testid=contact-us-category-${contactMessage.category}]`
    ).click()
    cy.get(`[data-testid=contact-us-text]`).type(contactMessage.text)

    cy.intercept(
      {
        url: `/v1/feedback/${FAKE_BRIGHT_ID}/create`,
        method: 'POST',
      },
      {
        statusCode: 201,
      }
    ).as('submitFeedback')

    cy.get('[data-testid=contact-us-submit]').click()
    cy.wait('@submitFeedback')
      .its('request.body')
      .should(body => {
        expect(body).to.have.key('encryptedPayload')
      })
    cy.get(`.toast--${TOAST_SUCCESS}`)
  })
})
