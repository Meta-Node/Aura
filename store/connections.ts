import { ActionTree, MutationTree } from 'vuex'
import { getConnections } from '~/scripts/api/connections.service'
import { ConnectionsState, RootState } from '~/types/store'

export const state = (): ConnectionsState => ({
  connectionsData: [],
})

export const mutations: MutationTree<ConnectionsState> = {
  setConnectionsData(state, value) {
    state.connectionsData = value
  },
}

export const actions: ActionTree<ConnectionsState, RootState> = {
  async getConnectionsData({ commit }) {
    try {
      const brightId = localStorage.getItem('brightId')
      if (!brightId) {
        throw new Error('you need a bright ID')
      }
      const res = await getConnections(this.$backendApi, brightId)
      if (res?.data?.connections) {
        let conn = res.data.connections
        conn = conn.sort(con => {
          if (con.conn?.level === 'just met') {
            return -1
          }
          if (con.conn?.level === 'already known') {
            return 1
          }
          return 0
        })
        commit('setConnectionsData', conn)
      } else {
        throw new Error('We have no data in connections')
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
