describe('Login', () => {
  beforeEach(() => {
    cy.on('window:before:load', win => {
      cy.spy(win.console, 'error').as('spyWinConsoleError')
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn')
    })
    cy.intercept(
      {
        url: `**/api/**`,
      },
      {
        statusCode: 404,
      }
    )
  })

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  it('renders login', () => {
    cy.visit('/')
  })
})
