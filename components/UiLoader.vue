<template>
  <app-spinner :is-visible="isLoading" classes="app-loader" />
</template>

<script>
import AppSpinner from './AppSpinner.vue'
export default {
  components: { AppSpinner },
  computed: {
    isLoading() {
      return this.$store.state.app.loading
    },
  },
}
</script>