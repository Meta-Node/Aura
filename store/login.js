import { importBrightID, readChannelPromise } from '~/scripts/api/login.service'

export const state = () => ({
  isAuth: false,
  brightIdData: {},
  profileData: {},
})

export const mutations = {
  setBrightIdData(state, value) {
    state.brightIdData = value
  },
  setProfileData(state, value) {
    state.profileData = value
  },
}

export const actions = {
  async getBrightIdData({ commit, state, rootState }) {
    try {
      const data = await importBrightID()
      commit('setBrightIdData', data)
    } catch (error) {
      console.log(error)
    }
  },
  async getProfileData({ commit, state, rootState }) {
    try {
      const res = await readChannelPromise(state.brightIdData)
      console.log(res)
      commit('setProfileData', res)
      localStorage.setItem('brightID', state.profileData.profile.id)
      localStorage.setItem('publicKey', state.brightIdData.signingKey)
      localStorage.setItem('privateKey', state.brightIdData.privateKey)
      localStorage.setItem('timestamp', state.brightIdData.timestamp)
    } catch (error) {
      console.log(error)
    }
  },
}
