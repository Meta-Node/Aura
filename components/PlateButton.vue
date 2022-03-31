<template>
  <div class="plate__btn">
    <button class="btn plate__button">
      <span class="plate__btn-text">{{ text }}</span>
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