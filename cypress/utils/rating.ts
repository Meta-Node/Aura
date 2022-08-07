import { AuraRating } from '../../types'
import {
  BRIGHT_ID_BACKUP,
  FAKE_BRIGHT_ID,
  ratedConnection,
  ratedConnection2,
  ratedConnection3,
  ratedConnectionNegative,
  ratedConnectionWithoutEnergy,
  unratedConnection,
} from './data'

export const oldRatings: AuraRating[] = [
  {
    id: 5050,
    toBrightId: ratedConnection.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '4',
    createdAt: '2021-07-10T20:59:03.036Z',
  },
  {
    id: 5050,
    toBrightId: ratedConnection2.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '2',
    createdAt: '2021-07-10T20:59:03.036Z',
  },
  {
    id: 5050,
    toBrightId: ratedConnection3.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '3',
    createdAt: '2021-07-10T20:59:03.036Z',
  },
  {
    id: 3040,
    toBrightId: ratedConnectionWithoutEnergy.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '1',
    createdAt: '2021-07-13T20:59:03.036Z',
  },
  {
    id: 6070,
    toBrightId: ratedConnectionNegative.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '-1',
    createdAt: '2021-07-11T20:59:03.036Z',
  },
]

export function getRatingObject(brightId: string, ratings: AuraRating[]) {
  return ratings.find(r => r.toBrightId === brightId)
}

export function getRating(brightId: string, ratings: AuraRating[]) {
  return getRatingObject(brightId, ratings)?.rating
}

export const newRatings: AuraRating[] = [
  {
    id: 5060,
    toBrightId: ratedConnection.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '-2',
    createdAt: '2021-07-10T20:59:03.036Z',
  },
  {
    id: 5050,
    toBrightId: ratedConnection2.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: String(getRating(ratedConnection2.id, oldRatings)),
    createdAt: '2021-07-10T20:59:03.036Z',
  },
  {
    id: 5050,
    toBrightId: ratedConnection3.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: String(getRating(ratedConnection3.id, oldRatings)),
    createdAt: '2021-07-10T20:59:03.036Z',
  },
  {
    id: 3040,
    toBrightId: ratedConnectionWithoutEnergy.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: String(getRating(ratedConnectionWithoutEnergy.id, oldRatings)),
    createdAt: '2021-07-13T20:59:03.036Z',
  },
  {
    id: 6080,
    toBrightId: ratedConnectionNegative.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '0.5',
    createdAt: '2021-07-11T20:59:03.036Z',
  },
  {
    id: 7080,
    toBrightId: unratedConnection.id,
    fromBrightId: FAKE_BRIGHT_ID,
    rating: '4',
    createdAt: '2021-07-17T20:59:03.036Z',
  },
]
export const AURA_RATINGS: {
  ratings: AuraRating[]
} = {
  ratings: oldRatings,
}

export const connectionsInCommunityFilterAll = [...BRIGHT_ID_BACKUP.connections]

export const connectionsInCommunityFilterAllSortedByNameAscending = [
  ...connectionsInCommunityFilterAll,
].sort((a, b) => a.name.localeCompare(b.name))

export const connectionsInCommunityFilterAllSortedByNameDescending = [
  ...connectionsInCommunityFilterAllSortedByNameAscending,
].reverse()

export const connectionsInCommunityAlreadyKnownPlus =
  connectionsInCommunityFilterAll.filter(
    user => user.level === 'already known' || user.level === 'recovery'
  )

export const connectionsInCommunityJustMet =
  connectionsInCommunityFilterAll.filter(user => user.level === 'just met')

export const connectionsInCommunityJustMetSortedByNameAscending = [
  ...connectionsInCommunityJustMet,
].sort((a, b) => a.name.localeCompare(b.name))

export const connectionsInCommunityJustMetSortedByNameDescending = [
  ...connectionsInCommunityJustMetSortedByNameAscending,
].reverse()
