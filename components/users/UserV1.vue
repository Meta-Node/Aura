<template>
  <li class="user-v1__item">
    <nuxt-link :to="url">
      <nuxt-img
        width="74"
        height="74"
        :src="img"
        :alt="name"
        class="user-v1__image"
        :class="[brightness && 'user-v1__image--brightness']"
        :style="`--brightness: ${brightness}px`"
        loading="lazy"
      />
      <p class="user-v1__tag">{{ name }}</p>
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