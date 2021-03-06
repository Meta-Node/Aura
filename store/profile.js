import { getProfile } from '~/scripts/api/connections.service'
import { pullProfilePhoto } from '~/scripts/api/login.service'
import { getRatedUsers } from '~/scripts/api/rate.service'

export const state = () => ({
  profileData: {},
  connections: [],
  ratedUsers: [],
})

export const mutations = {
  setProfileData(state, value) {
    state.profileData = value
  },
  setConnections(state, value) {
    state.connections = value
  },
  setRatedUsers(state, value) {
    state.ratedUsers = value
  },
}

export const actions = {
  async getProfileData({ commit, state, rootState }, isPublic) {
    try {
      const profileData = await this.$localForage.getItem('profileData')

      if (!profileData) {
        return
      }

      const profile = profileData?.profile
      const connections = profileData?.connections

      const res = await getProfile(profileData.profile.id, isPublic)
      const ratedUsers = await getRatedUsers()

      const nicknames = res?.data?.nicknames

      if (!nicknames) {
        return
      }

      const connectionsWithNicknames = connections.map(conn => ({
        ...conn,
        nickname: nicknames.find(nn => nn.toBrightId === conn.id)?.nickName,
        rating: ratedUsers.find(ru => ru.toBrightId === conn.id)?.rating,
      }))

      commit('setProfileData', { ...profile, ...res.data })
      commit('setConnections', connectionsWithNicknames)
      commit('setRatedUsers', ratedUsers)
    } catch (error) {
      throw error
    }
  },

  async getProfilePhoto({ commit, state, rootState }, brightId) {
    const privateKey = localStorage.getItem('authKey')
    const profileInfo = await this.$localForage.getItem('profileData')
    if (!profileInfo) {
      return
    }

    const profilePhoto = await pullProfilePhoto(
      privateKey,
      brightId,
      profileInfo.profile.password,
      this
    )

    return profilePhoto
  },
}

export const getters = {
  profileData: state => state.profileData,
  connections: state => state.connections,
  ratedUsers: state => state.ratedUsers,
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
