export const state = () => ({
  profile: [],
})

export const mutations = {
  setProfile(state, value) {
    state.profile = value
  },
}
