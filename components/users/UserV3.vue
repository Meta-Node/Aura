<template>
  <li class="user-v3__humans-list">
    <nuxt-link
      :to="url"
      class="user-v3__username"
    >
      <nuxt-img
        :src="profileAvatar"
        :alt="name"
        class="user-v3__image"
        width="48"
        height="48"
        loading="lazy"
      />
      <p class="user-v3__tag">{{ name }}</p>
      <small class="user-v2__rate">({{ rating }})</small>

    </nuxt-link>
    <div class="user-v3__numbers">
      <user-slider
        id="quality"
        type="range"
        :min="0"
        :max="100"
        :step="1"
        :value="energy"
        :quota="getQuota"
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
      this.$emit('changeEnergy', { amount: value, toBrightId: this.id })
    },
  },
}
</script>