<template>
  <button class="filter-button">{{ name }}</button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Name',
    },
  },
}
</script>