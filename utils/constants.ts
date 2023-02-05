import { ConnectionLevel, EnergyDomain } from '~/types'

export const CONNECTION_SEARCH_SEED = 5

export const TOAST_SUCCESS = 'success'
export const TOAST_ERROR = 'danger'

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
export const brightIdBaseURL = 'http://184.72.224.75'

export const RATING_INBOUND_STAT = 'ri'
export const RATING_OUTBOUND_STAT = 'ro'
export const ENERGY_INBOUND_STAT = 'ei'
export const ENERGY_OUTBOUND_STAT = 'eo'

export const MUTUAL_CONNECTIONS_TEST_NAMESPACE = 'mutual-connections-'

export enum DomainId {
  BRIGHTID = 'brightid',
  GITCOIN = 'gitcoin',
}

export const DOMAINS: EnergyDomain[] = [
  {
    id: DomainId.BRIGHTID,
    name: 'BrightID',
    logo: '/images/brightid.png',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    id: DomainId.GITCOIN,
    name: 'Gitcoin',
    logo: '/images/gitcoin.png',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
]
