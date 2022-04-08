import { getEnergy, transferEnergy } from '~/scripts/api/energy.service'
import { getRatedUsers } from '~/scripts/api/rate.service'

export const state = () => ({
  transferedEnergy: [],
  energyToTransfer: [],
  availableEnergy: 100,
})

export const mutations = {
  setAvailableEnergy(state, value) {
    state.availableEnergy = value
  },
  setTransferedEnergy(state, value) {
    state.transferedEnergy = value
  },
  setEnergyToTransfer(state, value) {
    state.energyToTransfer = state.energyToTransfer.map(el => ({
      ...state.transferedEnergy.find(en => en.toBrightId === el.toBrightId),
      ...el,
    }))
  },
}

export const actions = {
  async getTransferedEnergy({ commit, state }) {
    try {
      const { energy } = await getEnergy()
      const ratedUsers = await getRatedUsers()
      const moreThanZero = ratedUsers.filter(user => +user.rating >= 1)

      const allUsers = moreThanZero.map(user => ({
        toBrightId: user.toBrightId,
        amount:
          energy.find(en => en.toBrightId === user.toBrightId)?.amount || 0,
      }))

      const availableEnergy =
        100 -
        allUsers.reduce(
          (previousValue, currentValue) =>
            previousValue.amount + currentValue.amount,
          0
        )

      commit('setAvailableEnergy', availableEnergy)
      commit('setTransferedEnergy', allUsers)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  async updateEnergy({ commit, state }) {
    try {
      console.log(state.energyToTransfer)
      await transferEnergy(state.energyToTransfer)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
