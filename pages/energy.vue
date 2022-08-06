<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <div class="explorer__input-wrapper">
        <app-search
          ref="search"
          @searchValue="onSearchValue"
        />
      </div>
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
        <!--        <energy-indicator :percent="availableEnergy"/>-->
        <div class="switch">
          <div class="switch__wrapper">
            <button
              :class="[isView && 'switch__filter-button--active']"
              class="switch__filter-button"
              data-testid="energy-tab-switch-view"
              @click="onExplorerClick"
            >
              View
            </button>
            <button
              :class="[!isView && 'switch__filter-button--active']"
              class="switch__filter-button"
              data-testid="energy-tab-switch-set"
              @click="onEnergyClick"
            >
              Set
            </button>
          </div>
          <div class="enegry__screens">
            <transition
              mode="out-in"
              name="fade"
            >
              <app-explorer
                v-if="isView"
                :filters="filters"
                :users="users"
                @filtered="onFiltered"
              />
              <app-energy
                v-else
                :filters="filters"
                :users="users"
                @filtered="onFiltered"
                @getTransferedEnergy="getUserData"
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
// import EnergyIndicator from '~/components/EnergyIndicator.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'
import {ENERGY_TABS, TOAST_ERROR} from "~/utils/constants";

export default {
  components: {
    AppSearch,
    // EnergyIndicator,
    AppEnergy,
    AppExplorer,
    AppSpinner,
  },
  mixins: [transition, users],
  data() {
    return {
      isView: true,

      filters: [
        {
          name: 'Name',
          type: 'ordering',
          active: false,
          reverse: false,
        },
        {
          name: 'Outbound',
          type: 'ordering',
          active: false,
          reverse: false,
        },
        {
          name: 'Rated',
          type: 'ordering',
          active: false,
          reverse: false,
        },
        {
          name: 'Recent',
          type: 'ordering',
          active: false,
          reverse: false,
        },
        {
          name: 'Exclude Zeros',
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
    transferedEnergy() {
      return this.$store.state.energy.transferedEnergy
    },
    availableEnergy() {
      return this.$store.state.energy.availableEnergy || 0
    },
  },

  watch: {
    isView() {
      this.isView
        ? this.updateRouterQuery(ENERGY_TABS.VIEW)
        : this.updateRouterQuery(ENERGY_TABS.SET)
    },
  },

  beforeDestroy() {
    const queries = this.$route.query
    if (queries.tab) {
      delete queries.tab
    }
    this.$router.push({query: {...queries}})
  },
  mounted() {
    this.getTransferedEnergy()

    const routeQuery = this.$route.query?.tab

    if (routeQuery === ENERGY_TABS.VIEW) {
      this.isView = true
      return
    }
    if (routeQuery === ENERGY_TABS.SET) {
      this.isView = false
    }
  },
  methods: {
    getTransferedEnergy() {
      this.$store.dispatch('energy/getTransferedEnergy')
        .catch(error => {
          this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
          console.log(error)
        })
    },
    onExplorerClick() {
      this.isView = true
    },
    onEnergyClick() {
      this.isView = false
    },
    updateRouterQuery(tabName) {
      const queries = this.$route.query
      this.$router.push({query: {...queries, tab: tabName}})
    },
  },
}
</script>
