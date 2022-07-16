<template>
  <li class="user-v2__humans-list">
    <nuxt-link :to="url" class="user-v2__username">
      <nuxt-img
        :alt="name"
        :src="profileAvatar"
        class="user-v2__image"
        height="48"
        loading="lazy"
        width="48"
      />
      <p :data-testid="`user-v2-${id}-name`" class="user-v2__tag">{{ name }}</p>
      <small :data-testid="`user-v2-${id}-rating`" class="user-v2__rate">({{ rating }})</small>
    </nuxt-link>
    <div class="user-v2__numbers">
      <p :data-testid="`user-v2-${id}-inbound`" class="user-v2__num user-v2__num-inbound">{{ inbound }}</p>
      <p :data-testid="`user-v2-${id}-outbound`" class="user-v2__num user-v2__num-outbound">{{ outbound }}</p>
    </div>
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
      default: '/',
    },
    name: {
      type: String,
      default: 'Name',
    },
    rating: {
      type: Number,
      default: 0,
    },
    inbound: {
      type: String,
      default: '',
    },
    outbound: {
      type: String,
      default: '',
    },
  },
}
</script>
