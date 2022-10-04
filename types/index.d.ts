// TODO: add typescript eslint to fix linter problems
// TODO: update values
export type ConnectionLevel = 'already known' | 'just met' | 'recovery'
export type Connection = {
  id: string
  name: string
  connectionDate: number
  photo: {
    filename: string
  }
  status: 'verified'
  notificationToken: string
  level: ConnectionLevel
  socialMedia: any[]
  verifications: any[]
  reportReason: string | null
  timestamp: number
  incomingLevel: ConnectionLevel
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

export type LocalForageBrightIdBackup = {
  connections: Connection[]
  groups: any[]
  profile: {
    id: string
    name: string
    photo: {
      filename: string
    }
    password: string
  }
}

export type InboundEnergyAllocationItem = {
  fromBrightId: string
  amount: number
  scale: number
}
export type InboundEnergyAllocationList = InboundEnergyAllocationItem[]
export type InboundEnergyAllocationRetrieveResponse = {
  energy: InboundEnergyAllocationList
}

export type EnergyAllocationItem = {
  toBrightId: string
  amount: number
  scale: number
}
export type EnergyAllocationList = EnergyAllocationItem[]
export type EnergyAllocationRetrieveResponse = {
  energy: EnergyAllocationList
}
export type EnergyAllocationUpdateResponse = {
  energyAllocation: EnergyAllocationList
}

export type AuraConnection = {
  _id: string
  _key: string
  _rev: string
  createdAt: number
  // eslint-disable-next-line camelcase
  eligible_groups?: []
  // eslint-disable-next-line camelcase
  eligible_timestamp?: number
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
  nicknames: any[]
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

export type AppToast = {
  text: string
  color: 'success' | 'danger'
}

export type IncomingConnection = {
  id: string
  level: ConnectionLevel
  reportReason: string | null
  timestamp: number
}

export type IncomingConnectionsResponse = {
  data: {
    connections: IncomingConnection[]
  }
}
