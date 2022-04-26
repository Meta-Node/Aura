<template>
  <div class="profile__card-img">
    <img
      :style="`--brightness: ${brightness}px`"
      class="img profile__avatar"
      :src="img || '/images/avatar-thumb.jpg'"
      :alt="alt"
    />
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
      default: '/',
    },
    alt: {
      type: String,
      default: '/',
    },
    brightness: {
      type: Number,
      default: 0,
    },
  },
}
</script>