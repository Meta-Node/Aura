// TODO: add typescript eslint to fix linter problems
// TODO: update values

export type Connection = {
  id: string
  name: string
  connectionDate: number
  photo: {
    filename: string
  }
  status: 'verified'
  notificationToken: string
  level: 'already known' | 'just met' | 'recovery'
  socialMedia: any[]
  verifications: any[]
  reportReason: string | null
  timestamp: number
  incomingLevel: 'already known' | 'just met' | 'recovery'
}

export type BrightIdBackup = {
  userData: {
    id: string
    name: string
    photo: {
      filename: string
    }
  }
  connections: Connection[]
  groups: any[]
}

export type InboundEnergyAllocationItem = {
  fromBrightId: string
  amount: number
  scale: number
}
export type InboundEnergyAllocation = InboundEnergyAllocationItem[]
export type InboundEnergyAllocationRetrieveResponse = {
  energy: InboundEnergyAllocation
}

export type EnergyAllocationItem = {
  toBrightId: string
  amount: number
  scale: number
}
export type EnergyAllocation = EnergyAllocationItem[]
export type EnergyAllocationRetrieveResponse = {
  energy: EnergyAllocation
}
export type EnergyAllocationUpdateResponse = {
  energyAllocation: EnergyAllocation
}

export type AuraConnection = {
  _id: string
  _key: string
  _rev: string
  createdAt: number
  // eslint-disable-next-line camelcase
  eligible_groups: []
  // eslint-disable-next-line camelcase
  eligible_timestamp: number
  parent: string
  signingKeys: string[]
  conn?: {
    _key: string
    _id: string
    _from: string
    _to: string
    _rev: string
    initTimestamp: number
    level: string
    replacedWith: null
    reportReason: string | null
    timestamp: number
  }
}
export type AuraConnectionsResponse = {
  connections: AuraConnection[]
}

export type AuraPublicProfile = {
  brightIdDate: number
  numOfConnections: number
  rating: number
}

export type AuraProfile = AuraPublicProfile & {
  fourUnrated: AuraConnection[]
  nicknames: string[]
}

export type AuraRating = {
  id: number
  toBrightId: string
  fromBrightId: string
  rating: string
  createdAt: string
  updatedAt: string
}
export type AuraRatingRetrieveResponse = {
  ratings: AuraRating[]
}

export type ConnectionResponse = {
  connectedTimestamp: number
  energyAllocated?: {
    amount: number
  }
  fourUnrated: AuraConnection[]
  previousRating?: AuraRating
}
