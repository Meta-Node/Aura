import { ConnectionLevel } from '~/types'

export const CONNECTION_SEARCH_SEED = 5

export const TOAST_SUCCESS = 'success'
export const TOAST_ERROR = 'danger'

export const ENERGY_TABS = Object.freeze({
  VIEW: 'View',
  SET: 'Set',
})
export const connectionLevelMap: { [c in ConnectionLevel]: number } = {
  reported: 0,
  suspicious: 1,
  'already known': 2,
  'just met': 3,
  recovery: 4,
}
