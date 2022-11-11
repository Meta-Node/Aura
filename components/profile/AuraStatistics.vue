<template>
  <div>
    <h3 class="aura-statistics-title">
      Aura Statistics
    </h3>
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
        <td id="energyIn" data-testid="aura-statistics-energy-in">{{ inboundEnergyCount }}</td>
        <td id="energyOut" data-testid="aura-statistics-energy-out">{{ transferedEnergyCount }}</td>
      </tr>
      <tr>
        <td>honesty</td>
        <td id="honestyIn" data-testid="aura-statistics-honesty-in">{{ incomingRatingsCount }}</td>
        <td id="honestyOut" data-testid="aura-statistics-honesty-out">{{ ratedUsersCount }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {TOAST_ERROR} from "~/utils/constants";
import {getIncomingRatings, getRatedUsers} from "~/scripts/api/rate.service";
import {getEnergy, getInboundEnergy} from "~/scripts/api/energy.service";

export default {
  name: "AuraStatistics",
  props: {
    userId: {
      type: String,
    },
  },
  data() {
    return {
      callsDone: 0,

      // used if we are not on our own profile
      profileInboundEnergy: null,
      profileTransferedEnergy: null,
      profileRatedUsers: null,
      profileIncomingRatings: null,
    }
  },
  computed: {
    isLoading() {
      return this.callsDone < 4
    },
    transferedEnergyCount() {
      return this.userId ? this.profileTransferedEnergy?.length : this.$store.state.energy.transferedEnergy.filter(e => e.amount > 0)?.length
    },
    inboundEnergyCount() {
      return this.userId ? this.profileInboundEnergy?.length : this.$store.state.energy.inboundEnergy?.length
    },
    ratedUsersCount() {
      return this.userId ? this.profileRatedUsers?.length : this.$store.getters['profile/ratedUsers']?.length
    },
    incomingRatingsCount() {
      return this.userId ? this.profileIncomingRatings?.length : this.$store.getters['profile/incomingRatings']?.length
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
      if (this.userId) {
        console.log(this.userId)
        getIncomingRatings(this.userId).then(ratings => {
          this.profileIncomingRatings = ratings;
          onDone()
        })
        getRatedUsers(this.userId).then(ratings => {
          this.profileRatedUsers = ratings;
          onDone()
        })
        getEnergy(this.userId).then(res => {
          this.profileTransferedEnergy = res.energy;
          onDone()
        })
        getInboundEnergy(this.userId).then(res => {
          this.profileInboundEnergy = res.energy;
          onDone()
        })
      } else {
        this.$store.dispatch('profile/loadProfileData').then(onDone).catch(onError)
        this.$store.dispatch('profile/getIncomingRatings').then(onDone).catch(onError)
        this.$store.dispatch('energy/getTransferedEnergy').then(onDone).catch(onError)
        this.$store.dispatch('energy/getInboundEnergy').then(onDone).catch(onError)
      }
    },
  }
}
</script>

<style scoped>

</style>
