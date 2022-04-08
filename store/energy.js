import { getEnergy } from '~/scripts/api/energy.service'

export const state = () => ({
  transferedEnergy: {},
  energyToTransfer: {},
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
      const res = await getEnergy()
      commit('setTransferedEnergy', res.energy)
    } catch (error) {
      console.log(error)
      throw error
    }
  },
}
