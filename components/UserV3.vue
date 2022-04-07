<template>
  <li class="user-v3__humans-list">
    <nuxt-link :to="url" class="user-v3__username">
      <img
        :src="img"
        :alt="name"
        class="user-v3__image"
        width="48"
        height="48"
      />
      <p class="user-v3__tag">{{ name }}</p>
    </nuxt-link>
    <div class="user-v3__numbers">
      <user-slider
        id="quality"
        type="range"
        :min="0"
        :max="100"
        :step="1"
        :value="0"
        :quota="getQuota"
      />
    </div>
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
    rating: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    getQuota() {
      return this.rating * 25
    },
  },
}
</script>