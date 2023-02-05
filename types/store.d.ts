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
import { DomainId } from '~/utils/constants'

export type RootState = {}
export type BrightIdData = any // TODO: determine the type
export type LoginState = {
  isAuth: boolean
}
export type AppState = {
  activeDomainId: DomainId
  disableGlobalSearchResults: boolean
  searchValue: string
  hasUnsavedChanges: boolean
  loading: boolean
  isWebp: boolean
  isAuth: boolean
  isFirstVisitedRoute: boolean
}
export type ConnectionsState = {
  connectionsData: AuraConnection[]
}
export type EnergyState = {
  outboundEnergy: EnergyAllocationList
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
