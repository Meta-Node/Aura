<template>
  <div>
    <app-spinner
      v-if="isLoading"
      ref="indicator"
      :is-visible="true"
      classes="load-more"
    />
    <table v-else class="aura-statistics">
      <tbody>
      <tr>
        <th>Type</th>
        <th>In</th>
        <th>Out</th>
      </tr>
      <tr>
        <td>energy transfer</td>
        <td id="energyIn">{{ inboundEnergy.length }}</td>
        <td id="energyOut">{{ transferedEnergy.length }}</td>
      </tr>
      <tr>
        <td>honesty</td>
        <td id="honestyIn">{{ incomingRatings.length }}</td>
        <td id="honestyOut">{{ ratedUsers.length }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {TOAST_ERROR} from "~/utils/constants";

export default {
  name: "AuraStatistics",
  data() {
    return {
      callsDone: 0,
    }
  },
  computed: {
    isLoading() {
      return this.callsDone < 4
    },
    transferedEnergy() {
      return this.$store.state.energy.transferedEnergy
    },
    inboundEnergy() {
      return this.$store.state.energy.inboundEnergy
    },
    ratedUsers() {
      return this.$store.getters['profile/ratedUsers']
    },
    incomingRatings() {
      return this.$store.getters['profile/incomingRatings']
    },
  },
  mounted() {
    this.getUserData()
  },
  methods: {
    getUserData() {
      const onDone = () => {
        this.callsDone++;
      }
      const onError = error => {
        this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
        console.log(error)
      }
      this.$store.dispatch('profile/loadProfileData').then(onDone).catch(onError)
      this.$store.dispatch('profile/getIncomingRatings').then(onDone).catch(onError)
      this.$store.dispatch('energy/getTransferedEnergy').then(onDone).catch(onError)
      this.$store.dispatch('energy/getInboundEnergy').then(onDone).catch(onError)
    },
  }
}
</script>

<style scoped>

</style>
