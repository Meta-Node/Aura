<template>
  <li class="user-v3__humans-list">
    <user-item-info :index="index" :user="user"></user-item-info>
    <span style="font-size: 12px;"><span
      :data-testid="`user-v3-${id}-inbound-percentage`">{{ user.inboundEnergyPercentage }}%</span></span>
    <div class="user-v3__numbers">
      <template v-if="rating">
        <energy-slider
          id="quality"
          v-model="value"
          :min="0"
          :user-id="id"
          type="range"
          @input="changeEnergy"
        />
      </template>
      <nuxt-link v-else :to="url">
        Not Rated Yet
      </nuxt-link>
    </div>
  </li>
</template>

<script>
import EnergySlider from '../EnergySlider'
import UserItemInfo from './UserItemInfo'
import avatar from '~/mixins/avatar'

export default {
  components: {UserItemInfo, EnergySlider},
  mixins: [avatar],
  props: {
    user: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: 0,
    },
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
