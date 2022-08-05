import { ActionTree, MutationTree } from 'vuex'
import {
  commitToBackend,
  importBrightID,
  loginByExplorerCode,
  pullDecryptedUserData,
  readChannelPromise,
} from '~/scripts/api/login.service'
import { BrightIdData, LoginState, RootState } from '~/types/store'

export const state = (): LoginState => ({
  isAuth: false,
  brightIdData: {},
  profileData: {},
})

export const mutations: MutationTree<LoginState> = {
  setBrightIdData(state, value: BrightIdData) {
    state.brightIdData = value
  },
  setProfileData(state, value: any) {
    if (value.userData) {
      delete value.userData
    }
    state.profileData = value
    // @ts-ignore
    this.$localForage.setItem('profileData', value)
  },
}

export const actions: ActionTree<LoginState, RootState> = {
  async loginByExplorerCode({ commit }, data) {
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
  async getBrightIdData({ commit }) {
    try {
      const data = await importBrightID()
      commit('setBrightIdData', data)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async getProfileData({ commit, state }) {
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
  async connectToBackend(_ctx) {
    try {
      await commitToBackend()
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  logout({ commit }) {
    localStorage.removeItem('brightId')
    localStorage.removeItem('publicKey')
    localStorage.removeItem('privateKey')
    localStorage.removeItem('timestamp')
    localStorage.removeItem('authKey')
    // @ts-ignore
    this.$localForage.removeItem('profileData')
    commit('app/setIsAuth', false, { root: true })
  },
}
