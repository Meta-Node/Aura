<template>
  <section class="energy app-page">
    <div class="container energy__wrapper">
      <div
        v-if="isLoading"
        style="margin-top: 40px"
      >
        <app-spinner :is-visible="true"/>
      </div>
      <div v-else>
        <div class="explorer-energy">
          <h3 class="explorer-energy__indicator-text">Energy</h3>
        </div>
        <div class="enegry__screens">
          <app-energy
            :filters="filters"
            :users="users"
            @clearFilters="clearFilters"
            @filtered="onFiltered"
            @getTransferredEnergy="getUserData"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppSpinner from '~/components/AppSpinner.vue'
import AppEnergy from '~/components/energy/AppEnergy'
import transition from '~/mixins/transition'
import users from '~/mixins/users'
import {TOAST_ERROR} from "~/utils/constants";
import {toRoundedPercentage} from "~/utils/numbers";
import unsavedChanges from "~/mixins/unsavedChanges";

const filterKey = 'energyFilters'
export default {
  components: {
    // EnergyIndicator,
    AppEnergy,
    AppSpinner,
  },
  mixins: [transition, users, unsavedChanges],

  data() {
    return {
      isLoadingInitialData: true,
      filterKey,
      filters: [
        {
          name: 'Name',
          type: 'ordering',
          defaultAscending: true,
          active: false,
          reverse: true,
        },
        {
          name: 'Outbound',
          type: 'ordering',
          defaultAscending: false,
          active: false,
          reverse: false,
        },
        {
          name: 'Rated',
          type: 'ordering',
          defaultAscending: false,
          active: false,
          reverse: false,
        },
        {
          name: 'Recent',
          type: 'ordering',
          defaultAscending: false,
          active: false,
          reverse: false,
        },
        {
          name: 'Exclude Zeros',
          type: 'filter',
          active: false,
        }
      ],
    }
  },
  head() {
    return {
      title: `Aura | Energy`,
    }
  },
  computed: {
    transferredEnergy() {
      return this.$store.state.energy.transferredEnergy
    },
    availableEnergy() {
      return this.$store.state.energy.availableEnergy || 0
    },
  },
  watch: {
    unsavedChangedEnergies: {
      immediate: true,
      handler(value) {
        this.hasUnsavedChanges = !!value?.length && !this.isLoadingInitialData
      }
    }
  },
  mounted() {
    this.getTransferredEnergy()
  },
  methods: {
    async getUserData() {
      try {
        this.isLoading = true
        await this.loadUserProfile()

        const ratedUsers = this.$store.getters['profile/ratedUsers']
        await this.$store.dispatch('energy/getTransferredEnergy')
        await this.$store.dispatch('energy/getInboundEnergy')

        const finalUsers = this.connections.map(conn => {
          const ratingData = ratedUsers.find(
            user => user.toBrightId === conn.id
          )
          const inboundEnergyObject = this.inboundEnergy.find(
            en => en.fromBrightId === conn.id
          )
          const outboundEnergyObject = this.transferredEnergy.find(
            en => en.toBrightId === conn.id
          )
          return {
            ratingData,
            rating: ratingData ? +ratingData.rating : undefined,
            transferredEnergyPercentage: outboundEnergyObject
              ? toRoundedPercentage(
                outboundEnergyObject.amount,
                outboundEnergyObject.scale
              )
              : 0,
            transferredEnergy: outboundEnergyObject?.amount || 0,
            inboundEnergyAmount: inboundEnergyObject?.amount || 0,
            inboundEnergyPercentage: inboundEnergyObject
              ? toRoundedPercentage(
                inboundEnergyObject.amount,
                inboundEnergyObject.scale
              )
              : 0,
            ...conn,
          }
        })
        this.startUsers = finalUsers
        this.setInitialFilter()
        this.isLoadingInitialData = false
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    getTransferredEnergy() {
      this.$store.dispatch('energy/getTransferredEnergy')
        .catch(error => {
          this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
          console.log(error)
        })
    },
  },
}
</script>
