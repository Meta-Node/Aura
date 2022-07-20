import {
  encryptData,
  encryptUserData,
  generateB64Keypair,
  hash,
} from '../../scripts/utils/crypto'
import { Connection, EnergyAllocation } from '../types'
import { toRoundedPercentage } from '../../utils/numbers'

const { publicKey, privateKey } = generateB64Keypair()
export const FAKE_PRIVATE_KEY = privateKey
export const FAKE_PUBLIC_KEY = publicKey
export const FAKE_BRIGHT_ID = 'iisPpbwQwXC5yLuNsi_7eXRLVEnFwGAHhS1Cc6KfxGD'
export const FAKE_BRIGHT_ID_PASSWORD = 'SamplePassword'
export const FAKE_USER_EXPLORER_CODE = encryptData(
  FAKE_BRIGHT_ID,
  FAKE_BRIGHT_ID_PASSWORD
)
export const FAKE_AUTH_KEY = hash(FAKE_BRIGHT_ID + FAKE_BRIGHT_ID_PASSWORD)
export const RANDOM_HASH = '4TuNvdmpfHkBFkqWQ7-X289O09SJw_FmplS9YexgpEp'
export const RANDOM_TIMESTAMP = 1640511387053
export const RANDOM_BLOCK_NUMBER = 10307210

// not sure if it works right
const toSigningKey = s => {
  const alts = {
    _: '/',
    '-': '+',
  }
  return s.replace(/[-_]/g, c => alts[c]) + '='
}

export const unratedConnection: Connection = {
  id: 'hbHxMhhLz_VpXgk8rKbTInQg7bJrhBfsMQqhDwphX08',
  name: 'Unrated Connection',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'hbHxMhhLz_VpXgk8rKbTInQg7bJrhBfsMQqhDwphX08.jpg',
  },
  status: 'verified',
  notificationToken: '017381a8-8acc-417b-8e77-d7b7cc9b37b7',
  level: 'already known',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'already known',
}

export const ratedConnection: Connection = {
  id: 'y-ZDOpXZDI9erfF2bR0tUguDsiyh2MUBQGnSKhIAf7q',
  name: 'Rated Connection',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'y-ZDOpXZDI9erfF2bR0tUguDsiyh2MUBQGnSKhIAf7q.jpg',
  },
  status: 'verified',
  notificationToken: '8bcfc21a-22ea-4a30-b398-b260efbf39af',
  level: 'already known',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'already known',
}

export const ratedConnectionWithoutEnergy: Connection = {
  id: 'Wy75bwx1dQ5r41tTwMj4wVmSymxzwRMM4wuG6jxtUJb',
  name: 'Rated No Energy',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'Wy75bwx1dQ5r41tTwMj4wVmSymxzwRMM4wuG6jxtUJb.jpg',
  },
  status: 'verified',
  notificationToken: '8bcfc21a-22ea-4a30-b398-b260efbf39af',
  level: 'already known',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'already known',
}

export const ratedConnectionNegative: Connection = {
  id: 'ZDI9erfF2bR0-ZDOpXtUguyDsiyh2MUBQGnSKhIAf7q',
  name: 'Rated Connection Negative',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'ZDI9erfF2bR0-ZDOpXtUguyDsiyh2MUBQGnSKhIAf7q.jpg',
  },
  status: 'verified',
  notificationToken: 'b87b2e1d-9a27-4309-96d7-1efc9c91544e',
  level: 'already known',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'already known',
}

export const BRIGHT_ID_BACKUP = {
  userData: {
    id: FAKE_BRIGHT_ID,
    name: 'My Name',
    photo: {
      filename: `${FAKE_BRIGHT_ID}.jpg`,
    },
  },
  connections: [
    unratedConnection,
    ratedConnection,
    ratedConnectionWithoutEnergy,
    ratedConnectionNegative,
  ],
  groups: [],
}

// TODO: move this logic and 'setProfileData' logic to utils file after migrating nuxt to typescript
export const LOCAL_FORAGE_DATA = {
  // remove userData key
  ...Object.fromEntries(
    Object.entries(BRIGHT_ID_BACKUP).filter(([k, v]) => k !== 'userData')
  ),
  profile: {
    ...BRIGHT_ID_BACKUP.userData,
    password: FAKE_BRIGHT_ID_PASSWORD,
  },
}

export const BRIGHT_ID_BACKUP_ENCRYPTED = encryptUserData(
  BRIGHT_ID_BACKUP,
  FAKE_BRIGHT_ID_PASSWORD
)

export const AURA_CONNECTIONS = {
  connections: BRIGHT_ID_BACKUP.connections.map(connection => ({
    _id: `users/${connection.id}`,
    _key: connection.id,
    _rev: '_dK3nJ5y-1-',
    createdAt: RANDOM_TIMESTAMP,
    eligible_groups: [],
    eligible_timestamp: RANDOM_TIMESTAMP + 1000000000,
    parent: RANDOM_HASH,
    signingKeys: [toSigningKey(connection.id)],
    conn: {
      _key: '97656970088',
      _id: 'connections/97656970088',
      _from: `users/${FAKE_BRIGHT_ID}`,
      _to: `users/${connection.id}`,
      _rev: '_dK3anJ5y-A',
      initTimestamp: RANDOM_TIMESTAMP,
      level: connection.level,
      replacedWith: null,
      reportReason: connection.reportReason,
      timestamp: RANDOM_TIMESTAMP,
    },
  })),
}

export const AURA_PROFILE = {
  numOfConnections: BRIGHT_ID_BACKUP.connections.length,
  brightIdDate: RANDOM_TIMESTAMP,
  fourUnrated: [
    AURA_CONNECTIONS.connections.find(con => con._id === unratedConnection.id),
  ],
  rating: 0,
  nicknames: [],
}

export const AURA_RATINGS = {
  ratings: [
    {
      id: 5050,
      toBrightId: ratedConnection.id,
      fromBrightId: FAKE_BRIGHT_ID,
      rating: '4',
      createdAt: '2021-07-10T20:59:03.036Z',
    },
    {
      id: 3040,
      toBrightId: ratedConnectionWithoutEnergy.id,
      fromBrightId: FAKE_BRIGHT_ID,
      rating: '3',
      createdAt: '2021-07-13T20:59:03.036Z',
    },
    {
      id: 6070,
      toBrightId: ratedConnectionNegative.id,
      fromBrightId: FAKE_BRIGHT_ID,
      rating: '-1',
      createdAt: '2021-07-11T20:59:03.036Z',
    },
  ],
}

export const PROFILE_PICTURE = encryptData(
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAC0ALQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwb/xAAcEAEBAQACAwEAAAAAAAAAAAAAEQEhQTFRYZH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBgf/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/APTqDyr6YAIAsASKKCCiAAIAQAWCUTFBAAABQSCiJXMWDo0AqIigCKABgqUQi4FABAASgKCIoBQihRBRKMAOigEAIolCAIABRekwiggsBEVRN0RQQABAFQTBQSueYKOlbAEoAQA8qBQFRKkFCoAIALClRQQTFAQqLBKE+CgRz0FdG0FVEqCgUAQEUEAxcSlSKFBAVERRRUhFBABAACsCjdaABAgqUSCwEBFASLDMQSKsIAAiioCUFIlKi4EEAAYMUbaqKAFAKiKKioRQAVEqACFBSFRFAABNAUKIKFGExTG2gUECCoqQKCBoqUqKQEAANASgoACkSlIAIuCAMYBjbQUAoKJUIAAAgChQhBUEigUoAIAIAoVQBBzWEHQAAD8FiUQiwCgogGAIAAAqCKCUwAADFxKILwCVzFHStEBUEUCpQBABQQXMCqAIACICgUBUqIoAYGArEAddUAZQAXVX2AgAAZyAgTkwERVgGoigiiAopnQAQBB//9k=',
  FAKE_BRIGHT_ID_PASSWORD
)

export const AURA_ENERGIES = {
  energy: [
    {
      toBrightId: ratedConnection.id,
      amount: 25,
    },
  ],
}

export const AURA_INBOUND_ENERGIES = {
  energy: [
    {
      fromBrightId: ratedConnection.id,
      amount: 2,
    },
  ],
}

export function getRating(brightId: string) {
  return AURA_RATINGS.ratings.find(r => r.toBrightId === brightId)?.rating
}

export function getOutboundEnergy(brightId: string) {
  return AURA_ENERGIES.energy.find(e => e.toBrightId === brightId)?.amount || 0
}

export function getInboundEnergy(brightId: string) {
  return (
    AURA_INBOUND_ENERGIES.energy.find(e => e.fromBrightId === brightId)
      ?.amount || 0
  )
}

export function getEnergyAllocationAmount(
  allocation: EnergyAllocation,
  brightId: string
) {
  return String(allocation.find(e => e.toBrightId === brightId)?.amount || 0)
}

export function getEnergyAllocationSum(allocation: EnergyAllocation) {
  return allocation.reduce((a, c) => a + c.amount, 0)
}

export function getEnergyAllocationPercentageString(
  allocation: EnergyAllocation,
  brightId: string
) {
  return (
    toRoundedPercentage(
      getEnergyAllocationAmount(allocation, brightId),
      getEnergyAllocationSum(allocation)
    ) + '%'
  )
}
