import { ConnectionLevel } from '~/types'

export const CONNECTION_SEARCH_SEED = 5

export const TOAST_SUCCESS = 'success'
export const TOAST_ERROR = 'danger'

export const ENERGY_TABS = Object.freeze({
  VIEW: 'View',
  SET: 'Set',
})

// eslint-disable-next-line no-unused-vars
export const connectionLevelMap: { [c in ConnectionLevel]: number } = {
  reported: 0,
  suspicious: 1,
  'just met': 2,
  'already known': 3,
  recovery: 4,
}

export const IS_PRODUCTION =
  (process.env.NUXT_ENV_VERCEL_ENV || process.env.NODE_ENV) === 'production'
