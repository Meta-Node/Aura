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
      <small v-if="rating" :data-testid="`user-v2-${id}-rating`" class="user-v2__rate">({{ rating }})</small>
    </nuxt-link>
    <div class="user-v2__numbers">
      <template v-if="rating">
        <p :data-testid="`user-v2-${id}-inbound`" class="user-v2__num user-v2__num-inbound">{{ inbound }}</p>
        <p :data-testid="`user-v2-${id}-outbound`" class="user-v2__num user-v2__num-outbound">{{
            outboundPercentage
          }}%</p>
      </template>
      <nuxt-link v-else :to="url">
        Not Rated Yet
      </nuxt-link>
    </div>
  </li>
</template>

<script>
import avatar from '~/mixins/avatar'
import energy from '~/mixins/energy'

export default {
  mixins: [avatar, energy],
  props: {
    url: {
      type: String,
      default: '/',
    },
    id: {
      type: String,
      default: '',
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
      type: Number,
      default: 0,
    },
  },
}
</script>
