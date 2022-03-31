<template>
  <li class="user-v2__humans-list">
    <nuxt-link :to="url" class="user-v2__username">
      <img
        :src="img"
        :alt="name"
        class="user-v2__image"
        width="48"
        height="48"
      />
      <p class="user-v2__tag">{{ name }}</p>
    </nuxt-link>
    <div class="user-v2__numbers">
      <user-slider
        id="quality"
        type="range"
        :min="0"
        :max="100"
        :step="25"
        :value="0"
      />
      <!-- <p class="user-v2__num user-v2__num-inbound">{{ inbound }}</p>
      <p class="user-v2__num user-v2__num-outbound">{{ outbound }}</p> -->
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