<template>
  <div class="profile__card-img">
    <nuxt-img
      :alt="alt"
      :src="img || '/images/avatar-thumb.jpg'"
      :style="`--brightness: ${brightness}px`"
      class="img profile__avatar"
    />
  </div>
</template>

<script>
export default {
  props: {
    img: {
      type: String,
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
