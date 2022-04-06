import { getConnections } from '~/scripts/api/connections.service'

export const state = () => ({
  connectionsData: {},
})

export const mutations = {
  setConnectionsData(state, value) {
    state.connectionsData = value
  },
}

export const actions = {
  async getConnectionsData({ commit, state, rootState }) {
    try {
      const brightId = localStorage.getItem('brightId')
      if (!brightId) {
        throw new Error('you need a bright ID')
      }
      const res = await getConnections(brightId)
      if (res?.data?.connections) {
        commit('setConnectionsData', res.data.connections)
      } else {
        throw new Error('We have no data in connections')
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
