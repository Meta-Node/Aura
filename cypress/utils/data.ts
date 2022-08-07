import {
  encryptData,
  encryptUserData,
  generateB64Keypair,
  hash,
} from '../../scripts/utils/crypto'
import {
  AuraConnection,
  AuraProfile,
  BrightIdBackup,
  Connection,
} from '../../types'

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
const toSigningKey = (s: string) => {
  const alts: {
    [key: string]: string
  } = {
    _: '/',
    '-': '+',
  }
  return s.replace(/[-_]/g, (c: string) => alts[c]) + '='
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

export const justMet: Connection = {
  id: 'k8rKbTInhbHxgQg7bJrhBfsMhhLz_VpXMQqhDwphX08',
  name: 'Just Met',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'k8rKbTInhbHxgQg7bJrhBfsMhhLz_VpXMQqhDwphX08.jpg',
  },
  status: 'verified',
  notificationToken: '00faf70f-8fcc-4129-8b5e-82037588e0e7',
  level: 'just met',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'just met',
}

export const justMet2: Connection = {
  id: 'TInQg7bJrhBfsMQqhhbHxMhhLz_VpXgk8rKbDwphX08',
  name: 'Just Met 2',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'TInQg7bJrhBfsMQqhhbHxMhhLz_VpXgk8rKbDwphX08.jpg',
  },
  status: 'verified',
  notificationToken: '691f81bf-e2b5-4f84-a22a-091ca9d5e6ae',
  level: 'just met',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'just met',
}

export const justMet3: Connection = {
  id: 'qhhbHxMhhLz_VpXgk8TInQg7bJrhBfsMQrKbDwphX08',
  name: 'Just Met 3',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'qhhbHxMhhLz_VpXgk8TInQg7bJrhBfsMQrKbDwphX08.jpg',
  },
  status: 'verified',
  notificationToken: '3b4d7526-6b2b-4fbf-9db2-333ff5f23da0',
  level: 'just met',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'just met',
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

export const ratedConnection2: Connection = {
  id: 'zx-DOpXZuDsiyh2MUBQGnSKhIADI9erfF2bR0tUgf7q',
  name: 'Rated Connection 2',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'zx-DOpXZuDsiyh2MUBQGnSKhIADI9erfF2bR0tUgf7q.jpg',
  },
  status: 'verified',
  notificationToken: '0230078e-2b66-4165-93e2-f0a3363c2540',
  level: 'already known',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'already known',
}

export const ratedConnection3: Connection = {
  id: 'px-9erfF2bR0DOpXZuDsiyh2MUBQGnSKhIADItUgf7q',
  name: 'Rated Connection 3',
  connectionDate: RANDOM_TIMESTAMP,
  photo: {
    filename: 'px-9erfF2bR0DOpXZuDsiyh2MUBQGnSKhIADItUgf7q.jpg',
  },
  status: 'verified',
  notificationToken: '1f00f451-5ca9-43fa-a6bc-5438cd720b31',
  level: 'recovery',
  socialMedia: [],
  verifications: [],
  reportReason: null,
  timestamp: RANDOM_TIMESTAMP,
  incomingLevel: 'recovery',
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

export const BRIGHT_ID_BACKUP: BrightIdBackup = {
  userData: {
    id: FAKE_BRIGHT_ID,
    name: 'My Name',
    photo: {
      filename: `${FAKE_BRIGHT_ID}.jpg`,
    },
  },
  connections: [
    unratedConnection,
    justMet,
    justMet3,
    justMet2,
    ratedConnection,
    ratedConnection2,
    ratedConnection3,
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

export const AURA_CONNECTIONS: {
  connections: AuraConnection[]
} = {
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

export const AURA_PROFILE: AuraProfile = {
  numOfConnections: BRIGHT_ID_BACKUP.connections.length,
  brightIdDate: RANDOM_TIMESTAMP,
  fourUnrated: [
    AURA_CONNECTIONS.connections.find(
      con => con._id.replace('users/', '') === unratedConnection.id
    )!,
  ],
  rating: 0,
  nicknames: [],
}

export const AURA_GENERAL_PROFILE: AuraProfile = {
  numOfConnections: 5,
  brightIdDate: RANDOM_TIMESTAMP,
  fourUnrated: [],
  rating: 0,
  nicknames: [],
}

export const PROFILE_PICTURE = encryptData(
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAC0ALQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwb/xAAcEAEBAQACAwEAAAAAAAAAAAAAEQEhQTFRYZH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBgf/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/APTqDyr6YAIAsASKKCCiAAIAQAWCUTFBAAABQSCiJXMWDo0AqIigCKABgqUQi4FABAASgKCIoBQihRBRKMAOigEAIolCAIABRekwiggsBEVRN0RQQABAFQTBQSueYKOlbAEoAQA8qBQFRKkFCoAIALClRQQTFAQqLBKE+CgRz0FdG0FVEqCgUAQEUEAxcSlSKFBAVERRRUhFBABAACsCjdaABAgqUSCwEBFASLDMQSKsIAAiioCUFIlKi4EEAAYMUbaqKAFAKiKKioRQAVEqACFBSFRFAABNAUKIKFGExTG2gUECCoqQKCBoqUqKQEAANASgoACkSlIAIuCAMYBjbQUAoKJUIAAAgChQhBUEigUoAIAIAoVQBBzWEHQAAD8FiUQiwCgogGAIAAAqCKCUwAADFxKILwCVzFHStEBUEUCpQBABQQXMCqAIACICgUBUqIoAYGArEAddUAZQAXVX2AgAAZyAgTkwERVgGoigiiAopnQAQBB//9k=',
  FAKE_BRIGHT_ID_PASSWORD
)
