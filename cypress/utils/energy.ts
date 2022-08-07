import {
  AuraRating,
  Connection,
  ConnectionResponse,
  EnergyAllocation,
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

export const AURA_ENERGIES = {
  energy: [
    {
      toBrightId: ratedConnection.id,
      amount: 25,
    },
    {
      amount: 50,
      toBrightId: ratedConnection2.id,
    },
    {
      amount: 5,
      toBrightId: ratedConnection3.id,
    },
  ],
}
export const AURA_INBOUND_ENERGIES = {
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

export function getInboundEnergyPercentage(brightId: string) {
  const inboundEnergy = AURA_INBOUND_ENERGIES.energy.find(
    e => e.fromBrightId === brightId
  )
  if (!inboundEnergy) return '0%'
  return toRoundedPercentage(inboundEnergy.amount, inboundEnergy.scale) + '%'
}

export const oldEnergyAllocation: EnergyAllocation = AURA_ENERGIES.energy
export const newEnergyAllocation: EnergyAllocation = [
  {
    amount: 100,
    toBrightId: ratedConnectionWithoutEnergy.id,
  },
  {
    amount: 5,
    toBrightId: ratedConnection.id,
  },
  {
    amount: 50,
    toBrightId: ratedConnection2.id,
  },
  {
    amount: 5,
    toBrightId: ratedConnection3.id,
  },
]

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
      Number(getEnergyAllocationAmount(allocation, brightId)),
      getEnergyAllocationSum(allocation)
    ) + '%'
  )
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
