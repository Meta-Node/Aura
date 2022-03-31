<template>
  <div class="text__btn">
    <button class="btn text__button">
      <span class="text__btn-content">{{ text }}</span>
    </button>
  </div>
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