import {ActionTree, GetterTree, MutationTree} from 'vuex'
import {getEnergy, getInboundEnergy, transferEnergy,} from '~/scripts/api/energy.service'
import {getRatedUsers} from '~/scripts/api/rate.service'
import {EnergyState, RootState} from '~/types/store'

export const state = (): EnergyState => ({
  outboundEnergy: [],
  transferredEnergy: [],
  prevTransferredEnergy: [],
  inboundEnergy: [],
  availableEnergy: 100,
})

export const getters: GetterTree<EnergyState, RootState> = {
  outboundEnergy: state => state.outboundEnergy,
  transferredEnergy: state => state.transferredEnergy,
  inboundEnergy: state => state.inboundEnergy,
  transferredEnergyAmount: state => {
    const totalAmount = state.transferredEnergy.map(user => user.amount)
    return totalAmount.reduce((prev, cur) => prev + cur, 0)
  },
}

export const mutations: MutationTree<EnergyState> = {
  setAvailableEnergy(state, value) {
    state.availableEnergy = value
  },
  setPrevTransferredEnergy(state, value) {
    state.prevTransferredEnergy = value
  },
  setOutboundEnergy(state, value) {
    state.outboundEnergy = value
  },
  setTransferredEnergy(state, value) {
    state.transferredEnergy = value

    const totalAmount = state.transferredEnergy.map(user => user.amount)
    const transferredEnergyAmount = totalAmount.reduce(
      (prev, cur) => prev + cur,
      0
    )

    state.availableEnergy = +(100 - transferredEnergyAmount).toFixed(2)
  },

  setInboundEnergy(state, value) {
    state.inboundEnergy = value
  },
}

export const actions: ActionTree<EnergyState, RootState> = {
  async getTransferredEnergy({commit}) {
    try {
      const brightId = localStorage.getItem('brightId')
      if (!brightId) {
        throw new Error('BrightId is not defined')
      }

      const outboundEnergy = await getEnergy(this.$backendApi, brightId)
      commit('setOutboundEnergy', outboundEnergy)
      const ratedUsers = await getRatedUsers(this.$backendApi, brightId)

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
      commit('setPrevTransferredEnergy', allUsers)
      commit('setTransferredEnergy', allUsers)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async getInboundEnergy({commit}) {
    try {
      const brightId = localStorage.getItem('brightId')
      if (!brightId) {
        throw new Error('BrightId is not defined')
      }

      const inboundEnergy = await getInboundEnergy(this.$backendApi, brightId)

      commit('setInboundEnergy', inboundEnergy)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async updateEnergy({state}) {
    try {
      await transferEnergy(this.$backendApi, state.transferredEnergy)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
