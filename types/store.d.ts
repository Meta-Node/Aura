import {
  AppToast,
  AuraConnection,
  AuraProfile,
  AuraRating,
  Connection,
  EnergyAllocationList,
  InboundEnergyAllocationList,
  LocalForageBrightIdBackup,
} from '~/types/index'

export type RootState = {}
export type BrightIdData = any // TODO: determine the type
export type LoginState = {
  isAuth: boolean
}
export type AppState = {
  hasUnsavedChanges: boolean
  loading: boolean
  isWebp: boolean
  isAuth: boolean
}
export type ConnectionsState = {
  connectionsData: AuraConnection[]
}
export type EnergyState = {
  transferredEnergy: EnergyAllocationList
  prevTransferredEnergy: EnergyAllocationList
  inboundEnergy: InboundEnergyAllocationList
  availableEnergy: number
}

export type ProfileState = {
  localForageBrightIdBackup: LocalForageBrightIdBackup | null
  profileData: (LocalForageBrightIdBackup['profile'] & AuraProfile) | null
  connections: Connection[]
  ratedUsers: AuraRating[]
  incomingRatings: AuraRating[]
}

export type ToastState = {
  toasts: (AppToast & {
    id: Date
  })[]
}
