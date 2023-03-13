import { GetterTree, MutationTree } from 'vuex'
import { AppState, RootState } from '~/types/store'
import { DomainId, DOMAINS } from '~/utils/constants'

export const state = (): AppState => ({
  activeDomainId: DomainId.BRIGHTID,
  hasUnsavedChanges: false,
  loading: false,
  isWebp: false,
  isAuth: false,
  isFirstVisitedRoute: true,
  searchValue: '',
  disableGlobalSearchResults: false,
})

export const getters: GetterTree<AppState, RootState> = {
  isFirstVisitedRoute: state => state.isFirstVisitedRoute,
  searchValue: state => state.searchValue,
  activeDomain: state => DOMAINS.find(d => d.id === state.activeDomainId),
  disableGlobalSearchResults: state => state.disableGlobalSearchResults,
}

export const mutations: MutationTree<AppState> = {
  setActiveDomainId(state, value) {
    state.activeDomainId = value
    if (process.client) {
      localStorage.setItem('activeDomainId', value)
    }
  },
  setHasUnsavedChanges(state, value) {
    state.hasUnsavedChanges = value
  },
  setIsFirstVisitedRoute(state, value) {
    state.isFirstVisitedRoute = value
  },
  setSearchValue(state, value) {
    state.searchValue = value
  },
  setDisableGlobalSearchResults(state, value) {
    state.disableGlobalSearchResults = value
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
