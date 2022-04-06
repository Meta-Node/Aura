<template>
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
</template>
<script>
import transition from '~/mixins/transition'
import AppEnergy from '~/components/AppEnergy'
import AppExplorer from '~/components/AppExplorer'

export default {
  components: { AppEnergy, AppExplorer },
  mixins: [transition],

  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isExplorer: true,
    }
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
