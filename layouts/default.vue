<template>
  <div id="app">
    <app-grid />
    <ui-loader />
    <app-header />
    <Nuxt />
  </div>
</template>

<script>
import AppGrid from '~/components/AppGrid.vue'
import UiLoader from '~/components/UiLoader.vue'
import AppHeader from '~/components/AppHeader.vue'

export default {
  components: { AppGrid, UiLoader , AppHeader},

  async mounted() {
    const { default: supportsWebP } = await import('supports-webp')

    if (await supportsWebP) {
      this.$store.commit('app/setIsWebp', true)
    } else {
      this.$store.commit('app/setIsWebp', false)
    }

    const { winSizes } = await import('~/scripts/utils/winSizes')
    const { resize } = await import('@emotionagency/utils')
    resize.on(winSizes)
  },
}
</script>