<template>
  <div class="container toast-container">
    <transition-group name="fade" mode="out-in">
      <app-toast-item
        v-for="toast in toasts"
        :key="toast.id"
        :toast="toast"
        @hide="hide"
      />
    </transition-group>
  </div>
</template>

<script>
import AppToastItem from './AppToastItem.vue'

export default {
  components: { AppToastItem },
  computed: {
    toasts() {
      return this.$store.state.toast.toasts
    },
  },
  methods: {
    hide(id) {
      const filteredToasts = this.toasts.filter(toast => toast.id !== id)
      this.$store.commit('toast/updateToasts', filteredToasts)
    },
  },
}
</script>