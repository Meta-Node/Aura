import { MutationTree } from 'vuex'
import { AppState } from '~/types/store'

export const state = (): AppState => ({
  hasUnsavedChanges: false,
  loading: false,
  isWebp: false,
  isAuth: false,
})

export const mutations: MutationTree<AppState> = {
  setHasUnsavedChanges(state, value) {
    state.hasUnsavedChanges = value
  },
  setLoading(state, value) {
    state.loading = value
  },
  setIsWebp(state, value) {
    state.isWebp = value
  },
  setIsAuth(state, value) {
    state.isAuth = value
  },
}
