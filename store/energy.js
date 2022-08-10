import {
  getEnergy,
  getInboundEnergy,
  transferEnergy,
} from '~/scripts/api/energy.service'
import { getRatedUsers } from '~/scripts/api/rate.service'

export const state = () => ({
  transferedEnergy: [],
  inboundEnergy: [],
  availableEnergy: 100,
})

export const getters = {
  transferedEnergyAmount: state => {
    const totalAmount = state.transferedEnergy.map(user => user.amount)
    return totalAmount.reduce((prev, cur) => prev + cur, 0)
  },
}

export const mutations = {
  setAvailableEnergy(state, value) {
    state.availableEnergy = value
  },
  setTransferedEnergy(state, value) {
    state.transferedEnergy = value

    const totalAmount = state.transferedEnergy.map(user => user.amount)
    const transferedEnergyAmount = totalAmount.reduce(
      (prev, cur) => prev + cur,
      0
    )

    const availableEnergy = +(100 - transferedEnergyAmount).toFixed(2)

    state.availableEnergy = availableEnergy
  },

  setInboundEnergy(state, value) {
    state.inboundEnergy = value
  },
}

export const actions = {
  async getTransferedEnergy({ commit }) {
    try {
      const { energy: outboundEnergy } = await getEnergy()

      const ratedUsers = await getRatedUsers()
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
      commit('setTransferedEnergy', allUsers)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async getInboundEnergy({ commit }) {
    try {
      const { energy: inboundEnergy } = await getInboundEnergy()

      commit('setInboundEnergy', inboundEnergy)
    } catch (error) {
      console.log(error)
      throw error
    }
  },

  async updateEnergy({ state }) {
    try {
      await transferEnergy(state.transferedEnergy)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
