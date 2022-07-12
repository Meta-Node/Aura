import {
  AURA_PROFILE,
  AURA_RATINGS,
  BRIGHT_ID_BACKUP,
  BRIGHT_ID_BACKUP_ENCRYPTED,
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_PRIVATE_KEY,
  FAKE_PUBLIC_KEY,
  FAKE_USER_EXPLORER_CODE,
  FAKE_USER_PASSWORD,
  PROFILE_PICTURE,
} from '../utils/data'

describe('Login', () => {
  beforeEach(() => {
    cy.on('window:before:load', win => {
      cy.spy(win.console, 'error').as('spyWinConsoleError')
      cy.spy(win.console, 'warn').as('spyWinConsoleWarn')
    })
    cy.intercept(
      {
        url: `**/v1/**`,
      },
      {
        statusCode: 404,
      }
    )
    cy.intercept(
      {
        url: `**/brightid/**`,
      },
      {
        statusCode: 404,
      }
    )
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        body: 'OK',
      }
    ).as('explorerCode')
    cy.intercept(
      {
        url: `/brightid/backups/*/*`,
        method: 'GET',
      },
      {
        body: PROFILE_PICTURE,
      }
    )
    cy.intercept(
      {
        url: `/brightid/backups/${FAKE_AUTH_KEY}/data`,
        method: 'GET',
      },
      {
        body: BRIGHT_ID_BACKUP_ENCRYPTED,
      }
    )
    cy.intercept(
      {
        url: `/v1/profile/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: AURA_PROFILE,
      }
    )
    cy.intercept(
      {
        url: `/v1/ratings/${FAKE_BRIGHT_ID}`,
        method: 'GET',
      },
      {
        body: AURA_RATINGS,
      }
    )
  })

  afterEach(() => {
    cy.get('@spyWinConsoleError').should('have.callCount', 0)
    cy.get('@spyWinConsoleWarn').should('have.callCount', 0)
  })

  it('login', () => {
    cy.visit('/')
    cy.get('[data-testid=login-explorer-code]').type(FAKE_USER_EXPLORER_CODE)
    cy.get('[data-testid=login-password]').type(FAKE_USER_PASSWORD)
    cy.get('[data-testid=login-submit]').click()
    cy.wait('@explorerCode')
      .its('request.body')
      .should(body => {
        expect(body.brightId).to.eq(FAKE_BRIGHT_ID)
        expect(body.password).to.eq(FAKE_USER_PASSWORD)
        expect(body.key).to.eq(FAKE_AUTH_KEY)
        // eslint-disable-next-line no-unused-expressions
        expect(body.publicKey).to.be.not.null
      })
      .then(() => {
        expect(localStorage.getItem('brightId')).to.eq(FAKE_BRIGHT_ID)
      })
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
  })

  it('profile', () => {
    cy.on('window:before:load', win => {
      window.localStorage.setItem('authKey', FAKE_AUTH_KEY)
      window.localStorage.setItem('brightId', FAKE_BRIGHT_ID)
      window.localStorage.setItem('publicKey', FAKE_PUBLIC_KEY)
      window.localStorage.setItem('privateKey', FAKE_PRIVATE_KEY)
      window.localStorage.setItem('isAuth', '{"value":true}')
    })
    cy.visit('/')
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
    BRIGHT_ID_BACKUP.userData.name.split(' ').forEach(s => {
      cy.get(`[data-testid=profile-user-name]`).contains(s)
    })
    cy.get(`[data-testid=profile-user-info]`).contains(
      `${AURA_PROFILE.numOfConnections} Connections`
    )
    cy.get(
      `[data-testid=user-v1-${BRIGHT_ID_BACKUP.connections[0].id}-name]`
    ).contains(BRIGHT_ID_BACKUP.connections[0].name)
  })
})
