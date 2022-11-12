import { IS_PRODUCTION, TOAST_ERROR, TOAST_SUCCESS } from '~/utils/constants'

export default {
  data() {
    return {
      energyData: [],
    }
  },
  methods: {
    async updateEnergy() {
      try {
        this.$store.commit('app/setLoading', true)
        await this.$store.dispatch('energy/updateEnergy')
        this.$store.commit('toast/addToast', {
          text: 'Energy successfully updated',
          color: TOAST_SUCCESS,
        })
        // this.$router.push('/connections?filter=Unrated')
        this.$emit('getTransferedEnergy')
      } catch (error) {
        if (!IS_PRODUCTION) {
          this.debugError = JSON.stringify(error.response?.data)
        }
        if (error.message === 'retryRequest') {
          this.updateEnergy()
        } else {
          this.$store.commit('toast/addToast', {
            text: 'Error',
            color: TOAST_ERROR,
          })
        }
      } finally {
        this.$store.commit('app/setLoading', false)
      }
    },
    onChangeEnergy(data) {
      const updatedEnergy = this.energyData.filter(
        en => en.toBrightId !== data.toBrightId
      )
      updatedEnergy.push(data)
      this.energyData = updatedEnergy
      this.$store.commit('energy/setTransferedEnergy', this.energyData)
    },
  },
}
