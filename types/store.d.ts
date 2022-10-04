import {
  AppToast,
  AuraConnection,
  AuraProfile,
  Connection,
  EnergyAllocationList,
  InboundEnergyAllocationList,
  LocalForageBrightIdBackup,
} from '~/types/index'

export type RootState = {}
export type BrightIdData = any // TODO: determine the type
export type LoginState = {
  isAuth: boolean
  brightIdData: BrightIdData
  profileData: LocalForageBrightIdBackup | {}
}
export type AppState = {
  loading: boolean
  isWebp: boolean
  isAuth: boolean
}
export type ConnectionsState = {
  connectionsData: AuraConnection[]
}
export type EnergyState = {
  transferedEnergy: EnergyAllocationList
  inboundEnergy: InboundEnergyAllocationList
  availableEnergy: number
}
// TODO: determine the types
export type ProfileState = {
  profileData: (LocalForageBrightIdBackup & AuraProfile) | null
  connections: Connection[]
  ratedUsers: any[]
}
export type ToastState = {
  toasts: (AppToast & {
    id: Date
  })[]
}
