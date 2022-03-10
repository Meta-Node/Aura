<template>
  <section class="energy">
    <div class="container energy__wrapper">
      <div class="energy__main-filter">
        <button
          class="energy__main-button"
          :class="[isFlow && 'energy__main-button--active']"
          @click="onFlowClick"
        >
          Flow
        </button>
        <button
          class="energy__main-button"
          :class="[!isFlow && 'energy__main-button--active']"
          @click="onOverviewClick"
        >
          Overview
        </button>
      </div>
      <div class="enegry__screens">
        <app-flow v-if="isFlow" />
        <app-overview v-else />
      </div>
    </div>
  </section>
</template>

<script>
import AppFlow from '~/components/AppFlow.vue'
import AppOverview from '~/components/AppOverview.vue'
import transition from '~/mixins/transition'
export default {
  components: { AppFlow, AppOverview },
  mixins: [transition],

  data() {
    return {
      isFlow: true,
    }
  },
  methods: {
    onFlowClick() {
      this.isFlow = true
    },
    onOverviewClick() {
      this.isFlow = false
    },
  },
}
</script>