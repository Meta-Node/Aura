<template>
  <div id="app">
    <app-grid />
    <app-toast />
    <ui-loader />
    <app-header />
    <Nuxt />
  </div>
</template>

<script>
import AppGrid from '~/components/AppGrid.vue'
import UiLoader from '~/components/UiLoader.vue'
import AppHeader from '~/components/AppHeader.vue'
import AppToast from '~/components/AppToast.vue'

export default {
  components: { AppGrid, UiLoader, AppHeader, AppToast },

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

    const isAuth = JSON.parse(localStorage.getItem('isAuth') || '[]')

    if (isAuth.value) {
      this.$store.commit('app/setIsAuth', true)
      if (this.$route.name === 'index') {
        this.$router.push('/profile')
      }
      try {
        await this.$store.dispatch('connections/getConnectionsData')
        await this.$store.dispatch('profile/getProfileData')
      } catch (error) {
        console.log(error)
        this.$store.commit('toast/addToast', { text: 'Error', color: 'danger' })
      }
    } else {
      this.$store.commit('app/setIsAuth', false)
      this.$router.push('/')
    }
  },
}
</script>