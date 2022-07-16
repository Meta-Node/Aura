<template>
  <li class="user-v3__humans-list">
    <nuxt-link
      :to="url"
      class="user-v3__username"
    >
      <nuxt-img
        :alt="name"
        :src="profileAvatar"
        class="user-v3__image"
        height="48"
        loading="lazy"
        width="48"
      />
      <p :data-testid="`user-v3-${id}-name`" class="user-v3__tag">{{ name }}</p>
      <small :data-testid="`user-v3-${id}-rating`" class="user-v2__rate">({{ rating }})</small>
    </nuxt-link>
    <div class="user-v3__numbers">
      <user-slider
        id="quality"
        :max="100"
        :min="0"
        :quota="getQuota"
        :step="1"
        :user-id="id"
        :value="energy"
        type="range"
        @changeEnergy="changeEnergy"
      />
    </div>
  </li>
</template>

<script>
import avatar from '~/mixins/avatar'

export default {
  mixins: [avatar],
  props: {
    id: {
      type: String,
      default: '',
    },
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
    rating: {
      type: Number,
      default: 0,
    },
    energy: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    getQuota() {
      return this.rating * 25
    },
  },
  methods: {
    changeEnergy(value) {
      this.$emit('changeEnergy', {amount: value, toBrightId: this.id})
    },
  },
}
</script>
