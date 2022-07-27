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
  level: 'already known'
  socialMedia: any[]
  verifications: any[]
  reportReason: string | null
  timestamp: number
  incomingLevel: 'already known'
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
export type EnergyAllocationItem = {
  toBrightId: string
  amount: number
}
export type EnergyAllocation = EnergyAllocationItem[]

export type AuraConnection = {
  _id: string
  _key: string
  _rev: string
  createdAt: number
  eligible_groups: []
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

export type AuraProfile = {
  numOfConnections: number
  brightIdDate: number
  fourUnrated: AuraConnection[]
  rating: number
  nicknames: string[]
}

export type AuraRating = {
  id: number
  toBrightId: string
  fromBrightId: string
  rating: string
  createdAt: string
}

export type ConnectionResponse = {
  connectedTimestamp: number
  energyAllocated?: {
    amount: number
  }
  fourUnrated: AuraConnection[]
  previousRating?: AuraRating
}
