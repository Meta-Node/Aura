export const state = () => ({
  users: [],
})

export const mutations = {
  setUsers(state, value) {
    state.users = value
  },
}

export const actions = {
  async getUsers({ commit, state, rootState }) {
    if (!state.users.length) {
      try {
        const data = await fetch('https://jsonplaceholder.typicode.com/users')
        const users = await data.json()

        commit('setUsers', users)
      } catch (error) {
        console.log(error)
        throw error
      }
    } else {
      commit('setUsers', state.users)
    }
  },
}
