<template>
  <li class="user-v1__item">
    <nuxt-link :to="url">
      <nuxt-img
        :alt="name"
        :class="[brightness && 'user-v1__image--brightness']"
        :src="profileAvatar"
        :style="`--brightness: ${brightness}px`"
        class="user-v1__image"
        height="74"
        loading="lazy"
        width="74"
      />
      <p :data-testid="`user-v1-${id}-name`" class="user-v1__tag">{{ name || id }}</p>
    </nuxt-link>
  </li>
</template>

<script>
import avatar from '~/mixins/avatar'

export default {
  mixins: [avatar],
  props: {
    url: {
      type: String,
      default: '/',
    },
    id: {
      type: String,
      default: '/',
    },
    img: {
      type: String,
    },
    name: {
      type: String,
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
