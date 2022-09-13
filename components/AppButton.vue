<template>
  <button :data-testid="dataTestid" class="btn" @click="handleClick">
    <slot v-if="!loading"/>
    <span v-else><ButtonSpinner/></span>
  </button>
</template>

<script>
import ButtonSpinner from '@/components/ButtonSpinner.vue'

export default {
  components: {
    ButtonSpinner,
  },
  props: {
    dataTestid: {
      type: String,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClick(event) {
      if (!this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>
