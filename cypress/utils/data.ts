import { encryptData, encryptUserData, hash } from '../../scripts/utils/crypto'

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
export const BRIGHT_ID_BACKUP = encryptUserData(
  {
    userData: {
      id: `${FAKE_BRIGHT_ID}`,
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
        name: 'Sample Name',
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
  },
  FAKE_USER_PASSWORD
)
