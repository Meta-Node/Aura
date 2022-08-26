<template>
  <button :data-testid="dataTestid" class="btn">
    <slot v-if="!loading" />
    <span v-else><ButtonSpinner /></span>
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
    },
  },
}
</script>
