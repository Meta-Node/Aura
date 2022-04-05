export const state = () => ({
  loading: false,
  isWebp: false,
  isAuth: false,
})

export const mutations = {
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
