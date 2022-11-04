import {
  AuraProfile,
  AuraRating,
  Connection,
  IncomingConnection,
  IncomingConnectionsResponse,
} from '../../types'
import {
  justMet2,
  justMet3,
  RANDOM_TIMESTAMP,
  ratedConnection,
  ratedConnection2,
  ratedConnection3,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from './data'
import { incomingRatings } from './rating'

export const connectionToVisit = unratedConnection

const toIncomingConnectionFormat = (
  connection: Connection
): IncomingConnection => ({
  id: connection.id,
  level: connection.level,
  reportReason: connection.reportReason,
  timestamp: RANDOM_TIMESTAMP,
})

export const connectionIncomingConnections: IncomingConnection[] = [
  toIncomingConnectionFormat(justMet3),
  toIncomingConnectionFormat(ratedConnection),
  toIncomingConnectionFormat(ratedConnection2),
  toIncomingConnectionFormat(ratedConnection3),
  toIncomingConnectionFormat(ratedConnectionWithoutEnergy),
]

export const connectionIncomingConnectionsResponse: IncomingConnectionsResponse =
  {
    data: {
      connections: connectionIncomingConnections,
    },
  }

export const connectionProfile: AuraProfile = {
  numOfConnections:
    connectionIncomingConnectionsResponse.data.connections.length,
  brightIdDate: RANDOM_TIMESTAMP,
  fourUnrated: [],
  rating: 0,
  nicknames: [],
}

export const connectionIncomingRatings: AuraRating[] = [
  {
    id: 5050,
    toBrightId: unratedConnection.id,
    fromBrightId: justMet3.id,
    rating: '4',
    createdAt: '2021-07-10T20:59:03.036Z',
    updatedAt: '2021-07-12T20:59:03.036Z',
  },
  {
    id: 5050,
    toBrightId: unratedConnection.id,
    fromBrightId: ratedConnection.id,
    rating: '2',
    createdAt: '2021-07-10T20:59:03.036Z',
    updatedAt: '2021-07-12T23:59:03.036Z',
  },
  {
    id: 5050,
    toBrightId: unratedConnection.id,
    fromBrightId: ratedConnection3.id,
    rating: '3',
    createdAt: '2021-07-11T20:59:03.036Z',
    updatedAt: '2021-07-11T20:59:03.036Z',
  },
  {
    id: 3040,
    toBrightId: unratedConnection.id,
    fromBrightId: ratedConnectionWithoutEnergy.id,
    rating: '1',
    createdAt: '2021-07-13T20:59:03.036Z',
    updatedAt: '2021-07-15T20:59:03.036Z',
  },
  {
    id: 6070,
    toBrightId: unratedConnection.id,
    fromBrightId: justMet2.id,
    rating: '-1',
    createdAt: '2021-07-11T20:59:03.036Z',
    updatedAt: '2021-07-11T10:59:03.036Z',
  },
]

export const connectionIncomingRatingsResponse: {
  ratings: AuraRating[]
} = {
  ratings: incomingRatings,
}
