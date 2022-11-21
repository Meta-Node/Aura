import {GetterTree, MutationTree} from 'vuex'
import {AppState, RootState} from '~/types/store'

export const state = (): AppState => ({
  hasUnsavedChanges: false,
  loading: false,
  isWebp: false,
  isAuth: false,
  isFirstVisitedRoute: true,
})

export const getters: GetterTree<AppState, RootState> = {
  isFirstVisitedRoute: state => state.isFirstVisitedRoute
}

export const mutations: MutationTree<AppState> = {
  setHasUnsavedChanges(state, value) {
    state.hasUnsavedChanges = value
  },
  setIsFirstVisitedRoute(state, value) {
    state.isFirstVisitedRoute = value
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
