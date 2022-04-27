<template>
  <div class="infinity-scroll">
    <slot />
    <app-spinner
      v-if="!isDone"
      ref="indicator"
      :is-visible="true"
      classes="load-more"
    />
  </div>
</template>

<script>
import AppSpinner from './AppSpinner.vue'
let rafInst
export default {
  components: { AppSpinner },
  props: {
    infinityScrollActive: {
      type: Boolean,
      default: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  async mounted() {
    const { raf } = await import('@emotionagency/utils')
    rafInst = raf
    rafInst.on(this.scrollHandler)
  },
  beforeDestroy() {
    rafInst && rafInst.off(this.scrollHandler)
  },
  methods: {
    scrollHandler() {
      if (!this.infinityScrollActive) {
        return
      }
      const indicator = this.$refs.indicator.$el

      const bottomOfWindow = indicator.getBoundingClientRect().bottom

      if (bottomOfWindow < window.innerHeight) {
        this.$emit('loadMore')
      }
    },
  },
}
</script>