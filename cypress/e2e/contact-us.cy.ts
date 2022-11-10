import { FAKE_BRIGHT_ID } from '../utils/data'
import { TOAST_SUCCESS } from '../../utils/constants'

describe('Contact us', () => {
  beforeEach(() => {
    cy.setupProfile()
  })

  it('can send feedback', () => {
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
