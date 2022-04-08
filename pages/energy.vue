<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <div class="explorer__input-wrapper">
        <app-search @searchValue="onSearchValue" />
      </div>
      <energy-indicator :percent="100" />
      <div class="energy-switch">
        <div class="energy-switch__wrapper">
          <button
            class="energy-switch__filter-button"
            :class="[isExplorer && 'energy-switch__filter-button--active']"
            @click="onExplorerClick"
          >
            Explorer
          </button>
          <button
            class="energy-switch__filter-button"
            :class="[!isExplorer && 'energy-switch__filter-button--active']"
            @click="onEnergyClick"
          >
            Energy
          </button>
        </div>
        <div class="enegry__screens">
          <transition name="fade" mode="out-in">
            <app-explorer v-if="isExplorer" :users="users" />
            <app-energy v-else :users="users" />
          </transition>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppSearch from '~/components/AppSearch.vue'
import AppEnergy from '~/components/energy/AppEnergy'
import AppExplorer from '~/components/energy/AppExplorer'
import EnergyIndicator from '~/components/EnergyIndicator.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'

export default {
  components: { AppSearch, EnergyIndicator, AppEnergy, AppExplorer },
  mixins: [transition, users],
  data() {
    return {
      isExplorer: true,
    }
  },
  computed: {
    transferedEnergy() {
      return this.$store.state.energy.transferedEnergy
    },
  },
  async mounted() {
    await this.$store.dispatch('energy/getTransferedEnergy')
  },
  methods: {
    onExplorerClick() {
      this.isExplorer = true
    },
    onEnergyClick() {
      this.isExplorer = false
    },
  },
}
</script>