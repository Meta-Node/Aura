<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <!-- <div class="energy__main-filter">
        <button
          class="energy__main-button"
          :class="[isExplorer && 'energy__main-button--active']"
          @click="onFlowClick"
        >
          Flow
        </button>
        <button
          class="energy__main-button"
          :class="[!isExplorer && 'energy__main-button--active']"
          @click="onOverviewClick"
        >
          Overview
        </button>
      </div> -->
      <div class="enegry__screens">
        <transition name="fade" mode="out-in">
          <app-explorer v-if="isExplorer" />
          <app-overview v-else />
        </transition>
      </div>
    </div>
  </section>
</template>

<script>
import AppExplorer from '~/components/AppExplorer.vue'
import AppOverview from '~/components/AppOverview.vue'
import transition from '~/mixins/transition'
export default {
  components: { AppExplorer, AppOverview },
  mixins: [transition],

  data() {
    return {
      isExplorer: true,
    }
  },
  methods: {
    onFlowClick() {
      this.isExplorer = true
    },
    onOverviewClick() {
      this.isExplorer = false
    },
  },
}
</script>