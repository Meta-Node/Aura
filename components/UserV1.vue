<template>
  <li class="profile__item">
    <nuxt-link :to="url">
      <img
        :src="img"
        :alt="name"
        class="profile__image"
        :class="[brightness && 'profile__image--brightness']"
        :style="`--brightness: ${brightness}px`"
      />
      <p class="profile__tag">{{ name }}</p>
    </nuxt-link>
  </li>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      default: '/',
    },
    img: {
      type: String,
      default: '/',
    },
    name: {
      type: String,
      default: 'Name',
    },
    isBrightness: {
      type: Boolean,
      default: false,
    },
    brightness: {
      type: Number,
      default: 0,
    },
  },
}
</script>