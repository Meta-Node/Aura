import {
  commitToBackend,
  importBrightID,
  loginByExplorerCode,
  readChannelPromise,
  pullDecryptedUserData,
} from '~/scripts/api/login.service'

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
    if (value.userData) {
      delete value.userData
    }
    state.profileData = value
    this.$localForage.setItem('profileData', value)
  },
}

export const actions = {
  async loginByExplorerCode({ commit, state, rootState }, data) {
    try {
      const brightIdData = await loginByExplorerCode(
        data.explorer,
        data.password
      )
      localStorage.setItem('brightId', brightIdData.brightId)
      localStorage.setItem('publicKey', brightIdData.publicKey)
      localStorage.setItem('privateKey', brightIdData.privateKey)
      localStorage.setItem('authKey', brightIdData.authKey)

      const profileData = await pullDecryptedUserData(
        brightIdData.authKey,
        brightIdData.password,
        this
      )
      commit('setProfileData', {
        ...profileData,
        profile: { ...profileData.userData, password: brightIdData.password },
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async getBrightIdData({ commit, state, rootState }) {
    try {
      const data = await importBrightID()
      commit('setBrightIdData', data)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async getProfileData({ commit, state, rootState }) {
    try {
      const res = await readChannelPromise(state.brightIdData, this)
      console.log(res)
      commit('setProfileData', res)
      localStorage.setItem('brightId', state.profileData.profile.id)
      localStorage.setItem('publicKey', state.brightIdData.signingKey)
      localStorage.setItem('privateKey', state.brightIdData.privateKey)
      localStorage.setItem('timestamp', state.brightIdData.timestamp)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async connectToBackend({ commit, state, rootState }) {
    try {
      await commitToBackend()
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  logout({ commit, state, rootState }) {
    localStorage.removeItem('brightId')
    localStorage.removeItem('publicKey')
    localStorage.removeItem('privateKey')
    localStorage.removeItem('timestamp')
    localStorage.removeItem('authKey')
    this.$localForage.removeItem('profileData')
    commit('app/setIsAuth', false, { root: true })
  },
}
