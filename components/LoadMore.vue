<template>
  <p class="load-more">
    <span class="load-more__text">{{ text }}</span>
  </p>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>