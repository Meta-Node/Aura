import {
  AURA_PROFILE,
  BRIGHT_ID_BACKUP,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_BRIGHT_ID_PASSWORD,
  FAKE_USER_EXPLORER_CODE,
  unratedConnection,
} from '../utils/data'

describe('Login', () => {
  beforeEach(() => {
    cy.on('window:before:load', win => {
      cy.spy(win.console, 'error').as('spyWinConsoleError')
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn')
    })
    // @ts-ignore
    cy.blockApiRequests()
  })

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  it('login', () => {
    // @ts-ignore
    cy.clearProfile()
    // @ts-ignore
    cy.profileIntercepts()
    cy.visit('/')
    cy.get('[data-testid=login-explorer-code]').type(FAKE_USER_EXPLORER_CODE)
    cy.get('[data-testid=login-password]').type(FAKE_BRIGHT_ID_PASSWORD)
    cy.get('[data-testid=login-submit]').click()
    cy.wait('@explorerCode')
      .its('request.body')
      .should(body => {
        expect(body.brightId).to.eq(FAKE_BRIGHT_ID)
        expect(body.password).to.eq(FAKE_BRIGHT_ID_PASSWORD)
        expect(body.key).to.eq(FAKE_AUTH_KEY)
        // eslint-disable-next-line no-unused-expressions
        expect(body.publicKey).to.be.not.null
      })
      .then(() => {
        expect(localStorage.getItem('brightId')).to.eq(FAKE_BRIGHT_ID)
        // localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
        // const data = await localforage.getItem('profileData')
        // expect(data).to.deep.eq(LOCAL_FORAGE_DATA)
      })
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
  })

  it('profile', () => {
    // @ts-ignore
    cy.setupProfile()
    cy.visit('/')
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
    BRIGHT_ID_BACKUP.userData.name.split(' ').forEach(s => {
      cy.get(`[data-testid=profile-user-name]`).contains(s)
    })
    cy.get(`[data-testid=profile-user-info]`).contains(
      `${AURA_PROFILE.numOfConnections} Connections`
    )
    cy.get(`[data-testid=user-v1-${unratedConnection.id}-name]`).contains(
      unratedConnection.name
    )
  })
})
