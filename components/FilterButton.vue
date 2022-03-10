<template>
  <button class="filter-button" :class="[active && 'filter-button--active']">
    {{ name }}
  </button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Name',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
}
</script>