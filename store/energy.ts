import { ActionTree, GetterTree, MutationTree } from 'vuex'
import {
  getEnergy,
  getInboundEnergy,
  transferEnergy,
} from '~/scripts/api/energy.service'
import { getRatedUsers } from '~/scripts/api/rate.service'
import { EnergyState, RootState } from '~/types/store'

export const state = (): EnergyState => ({
  transferedEnergy: [],
  prevTransferedEnergy: [],
  inboundEnergy: [],
  availableEnergy: 100,
})

export const getters: GetterTree<EnergyState, RootState> = {
  transferedEnergyAmount: state => {
    const totalAmount = state.transferedEnergy.map(user => user.amount)
    return totalAmount.reduce((prev, cur) => prev + cur, 0)
  },
}

export const mutations: MutationTree<EnergyState> = {
  setAvailableEnergy(state, value) {
    state.availableEnergy = value
  },
  setPrevTransferedEnergy(state, value) {
    state.prevTransferedEnergy = value
  },
  setTransferedEnergy(state, value) {
    state.transferedEnergy = value

    const totalAmount = state.transferedEnergy.map(user => user.amount)
    const transferedEnergyAmount = totalAmount.reduce(
      (prev, cur) => prev + cur,
      0
    )

    state.availableEnergy = +(100 - transferedEnergyAmount).toFixed(2)
  },

  setInboundEnergy(state, value) {
    state.inboundEnergy = value
  },
}

export const actions: ActionTree<EnergyState, RootState> = {
  async getTransferedEnergy({ commit }) {
    try {
      const brightId = localStorage.getItem('brightId')
      if (!brightId) {
        throw new Error('BrightId is not defined')
      }

      const outboundEnergy = await getEnergy(brightId)
      const ratedUsers = await getRatedUsers(brightId)

      const moreThanZero = ratedUsers.filter(user => +user.rating >= 1)

      const allUsers = moreThanZero.map(user => {
        const outboundEnergyObject = outboundEnergy.find(
          en => en.toBrightId === user.toBrightId
        )
        return {
          toBrightId: user.toBrightId,
          amount: outboundEnergyObject?.amount || 0,
          scale: outboundEnergyObject?.scale || 0,
        }
      })

      const totalAmount = allUsers.map(user => user.amount)

      const availableEnergy =
        100 - totalAmount.reduce((prev, cur) => prev + cur, 0)

      commit('setAvailableEnergy', availableEnergy)
      commit('setPrevTransferedEnergy', allUsers)
      commit('setTransferedEnergy', allUsers)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async getInboundEnergy({ commit }) {
    try {
      const brightId = localStorage.getItem('brightId')
      if (!brightId) {
        throw new Error('BrightId is not defined')
      }

      const inboundEnergy = await getInboundEnergy(brightId)

      commit('setInboundEnergy', inboundEnergy)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async updateEnergy({ state }) {
    try {
      await transferEnergy(this.$backendApi, state.transferedEnergy)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
