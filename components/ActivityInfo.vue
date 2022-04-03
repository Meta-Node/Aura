<template>
  <li class="activity__list">
    <div class="activity__info-block">
      <toggle-switch :id="id" />
      <div class="activity__text">
        <span class="activity__from-user"
          ><nuxt-link :to="fromUser.url">{{ fromUser.name }}</nuxt-link></span
        >
        <span class="activity__action">{{ action }}</span>
        <span class="activity__to-user"
          ><nuxt-link :to="toUser.url">{{ toUser.name }}</nuxt-link></span
        >
      </div>
      <p class="activity__time">{{ time }}</p>
    </div>
    <div class="activity__stripe"></div>
  </li>
</template>

<script>
import ToggleSwitch from '~/components/ToggleSwitch.vue'

export default {
  components: { ToggleSwitch },

  props: {
    action: {
      type: String,
      default: '',
    },
    fromUser: {
      type: Object,
      default: () => {},
    },
    toUser: {
      type: Object,
      default: () => {},
    },
    time: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
      default: 0,
      },
  },
}
</script>