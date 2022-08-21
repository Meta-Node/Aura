import { MutationTree } from 'vuex'
import { AppState } from '~/types/store'

export const state = (): AppState => ({
  loading: false,
  isWebp: false,
  isAuth: false,
})

export const mutations: MutationTree<AppState> = {
  setLoading(state, value) {
    state.loading = value
  },
  setIsWebp(state, value) {
    state.isWebp = value
  },
  setIsAuth(state, value) {
    state.isAuth = value
    localStorage.setItem('isAuth', JSON.stringify({ value }))
  },
}
