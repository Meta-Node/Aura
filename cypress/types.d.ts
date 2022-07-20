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
