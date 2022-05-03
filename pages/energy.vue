<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <div class="explorer__input-wrapper">
        <app-search @searchValue="onSearchValue" />
      </div>
      <div v-if="isLoading" style="margin-top: 40px">
        <app-spinner :is-visible="true" />
      </div>
      <div v-else>
        <energy-indicator :percent="availableEnergy" />
        <div class="switch">
          <div class="switch__wrapper">
            <button
              class="switch__filter-button"
              :class="[isExplorer && 'switch__filter-button--active']"
              @click="onExplorerClick"
            >
              Explorer
            </button>
            <button
              class="switch__filter-button"
              :class="[!isExplorer && 'switch__filter-button--active']"
              @click="onEnergyClick"
            >
              Energy
            </button>
          </div>
          <div class="enegry__screens">
            <transition name="fade" mode="out-in">
              <app-explorer
                v-if="isExplorer"
                :users="users"
                :filters="filters"
                @filtered="onFiltered"
              />
              <app-energy
                v-else
                :users="users"
                :filters="filters"
                @filtered="onFiltered"
              />
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import AppSearch from '~/components/AppSearch.vue'
import AppSpinner from '~/components/AppSpinner.vue'
import AppEnergy from '~/components/energy/AppEnergy'
import AppExplorer from '~/components/energy/AppExplorer'
import EnergyIndicator from '~/components/EnergyIndicator.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'

export default {
  components: {
    AppSearch,
    EnergyIndicator,
    AppEnergy,
    AppExplorer,
    AppSpinner,
  },
  mixins: [transition, users],
  data() {
    return {
      isExplorer: true,

      filters: [
        {
          name: 'Name',
          isIcon: true,
          active: false,
          reverse: false,
        },
        {
          name: 'Amount',
          isIcon: true,
          active: false,
          reverse: false,
        },
      ],
    }
  },

  head() {
    return {
      title: `Aura | Energy`,
    }
  },

  computed: {
    transferedEnergy() {
      return this.$store.state.energy.transferedEnergy
    },
    availableEnergy() {
      return this.$store.state.energy.availableEnergy || 0
    },
  },

  watch: {
    isExplorer() {
      this.isExplorer
        ? this.updateRouterQuery('Explorer')
        : this.updateRouterQuery('Energy')
    },
  },

  beforeDestroy() {
    const queries = this.$route.query
    if (queries.tab) {
      delete queries.tab
    }
    this.$router.push({ query: { ...queries } })
  },
  async mounted() {
    try {
      await this.$store.dispatch('energy/getTransferedEnergy')
    } catch (error) {
      this.$store.commit('toast/addToast', { text: 'Error', color: 'danger' })
      console.log(error)
    }

    const routeQuery = this.$route.query?.tab

    if (routeQuery === 'Explorer') {
      this.isExplorer = true
      return
    }
    if (routeQuery === 'Energy') {
      this.isExplorer = false
    }
  },
  methods: {
    onExplorerClick() {
      this.isExplorer = true
    },
    onEnergyClick() {
      this.isExplorer = false
    },
    updateRouterQuery(tabName) {
      const queries = this.$route.query
      this.$router.push({ query: { ...queries, tab: tabName } })
    },
  },
}
</script>