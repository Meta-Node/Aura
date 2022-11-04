import { ActionTree, MutationTree } from 'vuex'
import { loginByExplorerCode } from '~/scripts/api/login.service'
import { LoginState, RootState } from '~/types/store'

export const state = (): LoginState => ({
  isAuth: false,
})

export const mutations: MutationTree<LoginState> = {
  setIsAuth(state, value) {
    state.isAuth = value
  },
}

export const actions: ActionTree<LoginState, RootState> = {
  async loginByExplorerCode({ dispatch }, data) {
    try {
      const brightIdData = await loginByExplorerCode(
        data.explorer,
        data.password
      )
      localStorage.setItem('brightId', brightIdData.brightId)
      localStorage.setItem('publicKey', brightIdData.publicKey)
      localStorage.setItem('privateKey', brightIdData.privateKey)
      localStorage.setItem('authKey', brightIdData.authKey)

      await dispatch(
        'profile/getLocalForageBrightIdBackup',
        {
          authKey: brightIdData.authKey,
          password: brightIdData.password,
        },
        { root: true }
      )
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
