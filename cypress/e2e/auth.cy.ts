import localforage from 'localforage'
import {
  FAKE_AUTH_KEY,
  FAKE_BRIGHT_ID,
  FAKE_BRIGHT_ID_PASSWORD,
  FAKE_USER_EXPLORER_CODE,
  LOCAL_FORAGE_DATA,
} from '../utils/data'
import { TOAST_ERROR } from '../../utils/constants'

describe('Auth', () => {
  beforeEach(() => {
    localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
    localforage.removeItem('profileData')
    cy.profileIntercepts()
  })

  function doLogin() {
    cy.visit('/', {
      onBeforeLoad: function (window) {
        window.localStorage.removeItem('authKey')
        window.localStorage.removeItem('brightId')
        window.localStorage.removeItem('publicKey')
        window.localStorage.removeItem('privateKey')
      },
    })
    cy.get('[data-testid=login-explorer-code]').type(FAKE_USER_EXPLORER_CODE)
    cy.get('[data-testid=login-password]').type(FAKE_BRIGHT_ID_PASSWORD)
    cy.get('[data-testid=login-submit]').click()
  }

  function doLoginSuccess() {
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        body: 'OK',
      }
    ).as('explorerCode')
    doLogin()
  }

  it('login', () => {
    doLoginSuccess()
    cy.wait('@explorerCode')
      .its('request.body')
      .should(body => {
        expect(body.brightId).to.eq(FAKE_BRIGHT_ID)
        expect(body.password).to.eq(FAKE_BRIGHT_ID_PASSWORD)
        expect(body.key).to.eq(FAKE_AUTH_KEY)
        expect(body.publicKey).to.be.not.null
      })
      .then(() => {
        expect(localStorage.getItem('brightId')).to.eq(FAKE_BRIGHT_ID)
        expect(localStorage.getItem('authKey')).to.eq(FAKE_AUTH_KEY)
        expect(localStorage.getItem('publicKey')).to.be.not.null
        expect(localStorage.getItem('privateKey')).to.be.not.null
      })
    cy.url()
      .should('include', `/profile/${FAKE_BRIGHT_ID}`)
      .then(async () => {
        localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
        const data = await localforage.getItem('profileData')
        expect(data).to.deep.eq(LOCAL_FORAGE_DATA)
      })
    // stays logged in
    cy.visit('/')
    cy.url().should('include', `/profile/${FAKE_BRIGHT_ID}`)
  })

  async function isLoggedOut() {
    cy.url().should('eq', Cypress.config().baseUrl + `/`)
    expect(localStorage.getItem('brightId')).to.be.null
    expect(localStorage.getItem('authKey')).to.be.null
    expect(localStorage.getItem('publicKey')).to.be.null
    expect(localStorage.getItem('privateKey')).to.be.null
    localforage.config({ storeName: 'nuxtLocalForage', name: 'nuxtJS' })
    const data = await localforage.getItem('profileData')
    expect(data).to.be.null
  }

  it('handle login failed response', () => {
    cy.intercept(
      {
        url: `/v1/connect/explorer-code`,
        method: 'POST',
      },
      {
        statusCode: 500,
      }
    ).as('explorerCodeError')
    doLogin()
    cy.url().should('not.include', `/profile/${FAKE_BRIGHT_ID}`)
    cy.get(`.toast--${TOAST_ERROR}`).then(isLoggedOut)
  })

  it('logout', () => {
    doLoginSuccess()
    cy.get('[data-testid=nav-button]').click()
    cy.get('[data-testid=nav-logout-btn]').click().then(isLoggedOut)
    // stays logged out
    cy.visit('/').then(isLoggedOut)
  })
})
