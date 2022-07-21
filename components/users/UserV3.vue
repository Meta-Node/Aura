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
        v-model="value"
        :max="100"
        :min="0"
        :quota="getQuota"
        :step="1"
        :user-id="id"
        type="range"
        @input="changeEnergy"
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
    }
  },
  data() {
    return {
      value: 0,
    }
  },
  computed: {
    getQuota() {
      return this.rating * 25
    },
  },
  watch: {
    energy: {
      immediate: true,
      handler(newValue, _oldValue) {
        this.value = Number(newValue);
      }
    }
  },
  methods: {
    changeEnergy(value) {
      this.$emit('changeEnergy', {amount: Number(value), toBrightId: this.id})
    },
  },
}
</script>
