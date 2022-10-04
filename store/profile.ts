import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { getProfile } from '~/scripts/api/connections.service'
import { pullProfilePhoto } from '~/scripts/api/login.service'
import { getRatedUsers } from '~/scripts/api/rate.service'
import { ProfileState, RootState } from '~/types/store'
import { LocalForageBrightIdBackup } from '~/types'

export const state = (): ProfileState => ({
  profileData: null,
  connections: [],
  ratedUsers: [],
})

export const getters: GetterTree<ProfileState, RootState> = {
  profileData: state => state.profileData,
  connections: state => state.connections,
  ratedUsers: state => state.ratedUsers,
  fourUnrated: state => {
    let fourUnrated: any = Object.assign([], state.profileData?.fourUnrated)
    fourUnrated = fourUnrated?.map((profile: any) => {
      const brightId = profile.conn?._to.replace('users/', '')
      const connectionInfo = state.connections.find(
        conn => conn.id === brightId
      )
      return {
        ...connectionInfo,
      }
    })
    return fourUnrated
  },
}

export const mutations: MutationTree<ProfileState> = {
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

export const actions: ActionTree<ProfileState, RootState> = {
  async getProfileData({ commit }, isPublic) {
    try {
      const profileData: LocalForageBrightIdBackup =
        // @ts-ignore
        await this.$localForage.getItem('profileData')

      if (!profileData) {
        return
      }

      const profile = profileData?.profile
      const connections = profileData?.connections

      const res = await getProfile(profileData.profile.id, isPublic)
      const ratedUsers = await getRatedUsers()

      // TODO: fix the issues with aura public and private profile types
      // @ts-ignore
      const nicknames: any[] = res?.data?.nicknames

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

  async getProfilePhoto(_ctx, brightId) {
    const privateKey = localStorage.getItem('authKey')!
    // @ts-ignore
    const profileInfo = await this.$localForage.getItem('profileData')
    if (!profileInfo) {
      return
    }

    return pullProfilePhoto(
      privateKey,
      brightId,
      profileInfo.profile.password,
      this
    )
  },
}
