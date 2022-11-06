import {
  AuraProfile,
  AuraRating,
  BrightIdConnection,
  BrightIdConnectionsResponse,
  Connection,
  ConnectionLevel,
} from '../../types'
import {connectionLevelMap} from '../../utils/constants'
import {
  justMet2,
  justMet3,
  RANDOM_TIMESTAMP,
  ratedConnection,
  ratedConnection2,
  ratedConnection3,
  ratedConnectionNegative,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from './data'

export const connectionToVisit = unratedConnection

const toIncomingConnectionFormat = (
  connection: Connection,
  level: ConnectionLevel
): BrightIdConnection => ({
  id: connection.id,
  level,
  reportReason: connection.reportReason,
  timestamp: RANDOM_TIMESTAMP,
})

export const connectionIncomingConnections: BrightIdConnection[] = [
  toIncomingConnectionFormat(ratedConnection2, 'already known'),
  toIncomingConnectionFormat(ratedConnection, 'suspicious'),
  toIncomingConnectionFormat(ratedConnection3, 'just met'),
  toIncomingConnectionFormat(ratedConnectionNegative, 'suspicious'),
  toIncomingConnectionFormat(ratedConnectionWithoutEnergy, 'recovery'),
  toIncomingConnectionFormat(justMet3, 'reported'),
]

export const connectionIncomingConnectionsResponse: BrightIdConnectionsResponse =
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
    rating: '-1',
    createdAt: '2021-07-10T20:59:03.036Z',
    updatedAt: '2021-07-12T20:59:03.036Z',
  },
  {
    id: 5090,
    toBrightId: unratedConnection.id,
    fromBrightId: ratedConnection.id,
    rating: '-4',
    createdAt: '2021-07-10T20:59:03.036Z',
    updatedAt: '2021-07-12T23:59:03.036Z',
  },
  {
    id: 3040,
    toBrightId: unratedConnection.id,
    fromBrightId: ratedConnectionWithoutEnergy.id,
    rating: '4',
    createdAt: '2021-07-13T20:59:03.036Z',
    updatedAt: '2021-07-15T20:59:03.036Z',
  },
  {
    id: 6000,
    toBrightId: unratedConnection.id,
    fromBrightId: ratedConnectionNegative.id,
    rating: '-1',
    createdAt: '2021-07-11T20:59:03.036Z',
    updatedAt: '2021-07-11T10:59:03.036Z',
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
  ratings: connectionIncomingRatings,
}

export const connectionIncomingConnectionsSortByConnectionLevelDescending = [
  ...connectionIncomingConnections,
].sort((a, b) => connectionLevelMap[b.level] - connectionLevelMap[a.level])

const getIncomingRatingFrom = (connection: BrightIdConnection) =>
  Number(
    connectionIncomingRatings.find(r => r.fromBrightId === connection.id)
      ?.rating || 0
  )

export const connectionIncomingConnectionsSortByTheirRatingDescending = [
  ...connectionIncomingConnections,
].sort((a, b) => getIncomingRatingFrom(b) - getIncomingRatingFrom(a))
