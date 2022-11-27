<template>
  <div id="app">
    <app-toast/>
    <ui-loader/>
    <app-header/>
    <Nuxt v-show="!showSearchResult"/>
    <connections v-show="showSearchResult"/>
  </div>
</template>

<script>
import UiLoader from '~/components/UiLoader.vue'
import AppHeader from '~/components/AppHeader.vue'
import AppToast from '~/components/AppToast.vue'
import Connections from "~/pages/connections";

export default {
  components: {UiLoader, AppHeader, AppToast, Connections},
  computed: {
    showSearchResult() {
      return this.searchValue && !this.disableGlobalSearch
    },
    searchValue() {
      return this.$store.getters["app/searchValue"]
    },
    disableGlobalSearch() {
      return this.$store.getters["app/disableGlobalSearch"]
    }
  },

  async mounted() {
    const {default: supportsWebP} = await import('supports-webp')

    if (await supportsWebP) {
      this.$store.commit('app/setIsWebp', true)
    } else {
      this.$store.commit('app/setIsWebp', false)
    }

    const {winSizes} = await import('~/scripts/utils/winSizes')
    const {resize} = await import('@emotionagency/utils')
    resize.on(winSizes)

    const brightId = localStorage.getItem('brightId')

    if (brightId) {
      this.$store.commit('app/setIsAuth', true)
      if (this.$route.name === 'index') {
        this.$router.push('/profile/' + brightId)
      }
    } else {
      this.$store.commit('app/setIsAuth', false)

      if (this.$route.query?.account !== 'public') {
        this.$router.push('/')
      }
    }
  },
}
</script>
