import { IS_PRODUCTION, TOAST_ERROR, TOAST_SUCCESS } from '~/utils/constants'
import unsavedChanges from '~/mixins/unsavedChanges'

export default {
  mixins: [unsavedChanges],
  data() {
    return {
      energyData: [],
    }
  },
  methods: {
    async updateEnergy(showToast) {
      try {
        this.$store.commit('app/setLoading', true)
        await this.$store.dispatch('energy/updateEnergy')
        if (showToast) {
          this.$store.commit('toast/addToast', {
            text: 'Energy successfully updated',
            color: TOAST_SUCCESS,
          })
        }
        this.hasUnsavedChanges = false
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
      const energyDoesNotExist = updatedEnergy.length === this.energyData.length
      if (energyDoesNotExist && data.amount === 0) return
      updatedEnergy.push(data)
      this.energyData = updatedEnergy
      this.$store.commit('energy/setTransferedEnergy', this.energyData)
    },
  },
}
