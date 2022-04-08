import { getProfile } from '~/scripts/api/connections.service'

export const state = () => ({
  profileData: {},
  connections: {},
})

export const mutations = {
  setProfileData(state, value) {
    state.profileData = value
  },
  setConnections(state, value) {
    state.connections = value
  },
}

export const actions = {
  async getProfileData({ commit, state, rootState }) {
    const profileData = JSON.parse(localStorage.getItem('profileData') || '[]')
    const profile = profileData?.profile
    const connections = profileData?.connections

    const res = await getProfile(profileData.profile.id)
    const nicknames = res.data.nicknames

    const connectionsWithNicknames = connections.map(conn => ({
      ...conn,
      nickname: nicknames.find(nn => nn.toBrightId === conn.id)?.nickName,
    }))

    commit('setProfileData', { ...profile, ...res.data })
    commit('setConnections', connectionsWithNicknames)
  },
}

export const getters = {
  profileData: state => state.profileData,
  connections: state => state.connections,
  fourUnrated: state => {
    let fourUnrated = state.profileData.fourUnrated
    fourUnrated = fourUnrated?.map(profile => {
      const brightId = profile.conn._to.replace('users/', '')
      const connectionInfo = state.connections.find(
        conn => conn.id === brightId
      )

      const obj = {
        ...connectionInfo,
      }
      return obj
    })
    return fourUnrated
  },
}
