import {
  encryptData,
  encryptUserData,
  generateB64Keypair,
  hash,
} from '../../scripts/utils/crypto'

const { publicKey, privateKey } = generateB64Keypair()
export const FAKE_PRIVATE_KEY = privateKey
export const FAKE_PUBLIC_KEY = publicKey
export const FAKE_USER_PASSWORD = 'SamplePassword'
export const FAKE_BRIGHT_ID = 'iisPpbwQwXC5yLuNsi_7eXRLVEnFwGAHhS1Cc6KfxGD'
export const FAKE_USER_EXPLORER_CODE = encryptData(
  FAKE_BRIGHT_ID,
  FAKE_USER_PASSWORD
)
export const FAKE_AUTH_KEY = hash(FAKE_BRIGHT_ID + FAKE_USER_PASSWORD)
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

export const BRIGHT_ID_BACKUP = {
  userData: {
    id: FAKE_BRIGHT_ID,
    name: 'My Name',
    photo: {
      filename: `${FAKE_BRIGHT_ID}.jpg`,
    },
  },
  connections: [
    {
      id: 'hbHxMhhLz_VpXgk8rKbTInQg7bJrhBfsMQqhDwphX08',
      name: 'Sample Name',
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
    },
    {
      id: 'y-ZDOpXZDI9erfF2bR0tUguDsiyh2MUBQGnSKhIAf7q',
      name: 'Sample Name 2',
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
    },
  ],
  groups: [],
}

export const BRIGHT_ID_BACKUP_ENCRYPTED = encryptUserData(
  BRIGHT_ID_BACKUP,
  FAKE_USER_PASSWORD
)

export const AURA_PROFILE = {
  numOfConnections: BRIGHT_ID_BACKUP.connections.length,
  brightIdDate: RANDOM_TIMESTAMP,
  fourUnrated: [
    {
      _id: `users/${BRIGHT_ID_BACKUP.connections[0].id}`,
      _key: BRIGHT_ID_BACKUP.connections[0].id,
      _rev: '_dK3nJ5y-1-',
      createdAt: RANDOM_TIMESTAMP,
      eligible_groups: [],
      eligible_timestamp: RANDOM_TIMESTAMP + 1000000000,
      parent: RANDOM_HASH,
      signingKeys: [toSigningKey(BRIGHT_ID_BACKUP.connections[0].id)],
      conn: {
        _key: '97656970088',
        _id: 'connections/97656970088',
        _from: `users/${FAKE_BRIGHT_ID}`,
        _to: `users/${BRIGHT_ID_BACKUP.connections[0].id}`,
        _rev: '_dK3anJ5y-A',
        initTimestamp: RANDOM_TIMESTAMP,
        level: 'already known',
        replacedWith: null,
        reportReason: null,
        timestamp: RANDOM_TIMESTAMP,
      },
    },
  ],
  rating: 0,
  nicknames: [],
}

export const AURA_RATINGS = {
  ratings: [
    {
      id: 5050,
      toBrightId: BRIGHT_ID_BACKUP.connections[1].id,
      fromBrightId: FAKE_BRIGHT_ID,
      rating: '3',
      createdAt: '2021-07-10T20:59:03.036Z',
    },
  ],
}

export const PROFILE_PICTURE = encryptData(
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAC0ALQDASIAAhEBAxEB/8QAGAABAQEBAQAAAAAAAAAAAAAAAAECAwb/xAAcEAEBAQACAwEAAAAAAAAAAAAAEQEhQTFRYZH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBgf/xAAWEQEBAQAAAAAAAAAAAAAAAAAAEQH/2gAMAwEAAhEDEQA/APTqDyr6YAIAsASKKCCiAAIAQAWCUTFBAAABQSCiJXMWDo0AqIigCKABgqUQi4FABAASgKCIoBQihRBRKMAOigEAIolCAIABRekwiggsBEVRN0RQQABAFQTBQSueYKOlbAEoAQA8qBQFRKkFCoAIALClRQQTFAQqLBKE+CgRz0FdG0FVEqCgUAQEUEAxcSlSKFBAVERRRUhFBABAACsCjdaABAgqUSCwEBFASLDMQSKsIAAiioCUFIlKi4EEAAYMUbaqKAFAKiKKioRQAVEqACFBSFRFAABNAUKIKFGExTG2gUECCoqQKCBoqUqKQEAANASgoACkSlIAIuCAMYBjbQUAoKJUIAAAgChQhBUEigUoAIAIAoVQBBzWEHQAAD8FiUQiwCgogGAIAAAqCKCUwAADFxKILwCVzFHStEBUEUCpQBABQQXMCqAIACICgUBUqIoAYGArEAddUAZQAXVX2AgAAZyAgTkwERVgGoigiiAopnQAQBB//9k=',
  FAKE_USER_PASSWORD
)
