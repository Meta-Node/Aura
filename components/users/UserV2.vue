<template>
  <li class="user-v2__humans-list">
    <user-item-info :index="index" :user="user"></user-item-info>
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
import UserItemInfo from './UserItemInfo'
import avatar from '~/mixins/avatar'
import energy from '~/mixins/energy'

export default {
  components: {UserItemInfo},
  mixins: [avatar, energy],
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0,
    },
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
