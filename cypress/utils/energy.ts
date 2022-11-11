import {
  AuraRating,
  Connection,
  ConnectionResponse,
  EnergyAllocationList,
  InboundEnergyAllocationRetrieveResponse,
} from '../../types'
import { toRoundedPercentage } from '../../utils/numbers'
import {
  BRIGHT_ID_BACKUP,
  ratedConnection,
  ratedConnection2,
  ratedConnection3,
  ratedConnectionWithoutEnergy,
} from './data'
import { getRating, getRatingObject, oldRatings } from './rating'

export const AURA_ENERGIES: {
  energy: EnergyAllocationList
} = {
  energy: [
    {
      toBrightId: ratedConnection.id,
      amount: 25,
      // scale is not the actual sum (80) in test to test the compatibility with the old energy system
      scale: 90,
    },
    {
      toBrightId: ratedConnection2.id,
      amount: 50,
      scale: 90,
    },
    {
      toBrightId: ratedConnection3.id,
      amount: 5,
      scale: 90,
    },
  ],
}
export const AURA_INBOUND_ENERGIES: InboundEnergyAllocationRetrieveResponse = {
  energy: [
    {
      fromBrightId: ratedConnection.id,
      amount: 2,
      scale: 2,
    },
    {
      fromBrightId: ratedConnection2.id,
      amount: 25,
      scale: 50,
    },
  ],
}

export function getInboundEnergyAmount(brightId: string) {
  const inboundEnergy = AURA_INBOUND_ENERGIES.energy.find(
    e => e.fromBrightId === brightId
  )
  return inboundEnergy?.amount || 0
}

export function getInboundEnergyPercentage(brightId: string) {
  const inboundEnergy = AURA_INBOUND_ENERGIES.energy.find(
    e => e.fromBrightId === brightId
  )
  if (!inboundEnergy) return '0%'
  return toRoundedPercentage(inboundEnergy.amount, inboundEnergy.scale) + '%'
}

export const oldEnergyAllocation: EnergyAllocationList = AURA_ENERGIES.energy
export const newEnergyAllocation: EnergyAllocationList = [
  {
    amount: 100,
    toBrightId: ratedConnectionWithoutEnergy.id,
    scale: 160,
  },
  {
    amount: 5,
    toBrightId: ratedConnection.id,
    scale: 160,
  },
  {
    amount: 50,
    toBrightId: ratedConnection2.id,
    scale: 160,
  },
  {
    amount: 5,
    toBrightId: ratedConnection3.id,
    scale: 160,
  },
]

export function getEnergyAllocationObject(
  allocation: EnergyAllocationList,
  brightId: string
) {
  return allocation.find(e => e.toBrightId === brightId)
}

export function getEnergyAllocationAmount(
  allocation: EnergyAllocationList,
  brightId: string
) {
  return String(getEnergyAllocationObject(allocation, brightId)?.amount || 0)
}

export function getEnergyAllocationSum(allocation: EnergyAllocationList) {
  return allocation.reduce((a, c) => a + c.amount, 0)
}

export function getEnergyAllocationPercentageStringInView(
  allocation: EnergyAllocationList,
  brightId: string
) {
  const energyAllocationObject = getEnergyAllocationObject(allocation, brightId)
  return energyAllocationObject
    ? toRoundedPercentage(
        energyAllocationObject.amount,
        energyAllocationObject.scale
      ) + '%'
    : '0%'
}

export function getEnergyAllocationPercentageStringInSet(
  allocation: EnergyAllocationList,
  brightId: string
) {
  const energyAllocationObject = getEnergyAllocationObject(allocation, brightId)
  return energyAllocationObject
    ? toRoundedPercentage(
        energyAllocationObject.amount,
        getEnergyAllocationSum(allocation)
      ) + '%'
    : '0%'
}

export function getConnectionResponse(
  connection: Connection,
  ratings: AuraRating[]
) {
  const obj: ConnectionResponse = {
    connectedTimestamp: connection.timestamp,
    fourUnrated: [],
  }
  const ratingObj = getRatingObject(connection.id, ratings)
  if (ratingObj) {
    obj.previousRating = ratingObj
  }
  const energy = getEnergyAllocationAmount(AURA_ENERGIES.energy, connection.id)
  if (energy) {
    obj.energyAllocated = {
      amount: Number(energy),
    }
  }
  return obj
}

export const connectionsInEnergyFilterAll = BRIGHT_ID_BACKUP.connections.filter(
  c => (getRating(c.id, oldRatings) || 0) >= 1
)

export const connectionsInEnergyFilterAllSortedByRateAscending = [
  ...connectionsInEnergyFilterAll,
].sort((a, b) => +getRating(a.id, oldRatings)! - +getRating(b.id, oldRatings)!)

export const connectionsInEnergyFilterAllSortedByRateDescending = [
  ...connectionsInEnergyFilterAllSortedByRateAscending,
].reverse()

export const connectionsInEnergyFilterAllSortedByRecentAscending = [
  ...connectionsInEnergyFilterAll,
].sort(
  (a, b) =>
    new Date(getRatingObject(a.id, oldRatings)!.updatedAt).getTime() -
    new Date(getRatingObject(b.id, oldRatings)!.updatedAt).getTime()
)

export const connectionsInEnergyFilterAllSortedByRecentDescending = [
  ...connectionsInEnergyFilterAllSortedByRecentAscending,
].reverse()

export const connectionsInEnergyFilterExcludeZero =
  connectionsInEnergyFilterAll.filter(
    c => +getEnergyAllocationAmount(oldEnergyAllocation, c.id) > 0
  )

export const connectionsInEnergyFilterExcludeZeroSortedByRateAscending = [
  ...connectionsInEnergyFilterExcludeZero,
].sort((a, b) => +getRating(a.id, oldRatings)! - +getRating(b.id, oldRatings)!)

export const connectionsInEnergyFilterExcludeZeroSortedByRateDescending = [
  ...connectionsInEnergyFilterExcludeZeroSortedByRateAscending,
].reverse()
