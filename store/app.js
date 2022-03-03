export const state = () => ({
  loading: false,
  isWebp: false,
})

export const mutations = {
  setLoading(state, value) {
    state.loading = value
  },
  setIsWebp(state, value) {
    state.isWebp = value
  }
}
