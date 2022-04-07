<template>
  <transition name="fade">
    <div v-if="isVisible" class="e-loader" :class="classes">
      <svg class="circular" viewBox="25 25 50 50">
        <circle
          class="path"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          stroke-width="2"
          stroke-miterlimit="10"
        />
      </svg>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    classes: {
      type: String,
      default: '',
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
}
</script>