<template>
  <li class="activity__list">
    <div class="activity__info-block">
      <toggle-switch :id="id" />
      <div class="activity__text">
        <span v-if="fromUser" class="activity__from-user"
          ><nuxt-link :to="'/profile/' + fromUser.id">{{
            fromUser.name
          }}</nuxt-link></span
        >
        <span class="activity__action">{{
          action.action + ' ' + action.amount
        }}</span>
        <span v-if="toUser" class="activity__to-user"
          ><nuxt-link :to="'/profile/' + toUser.id">{{
            toUser.name
          }}</nuxt-link></span
        >
      </div>
      <p class="activity__time">{{ computeDate(time) }}</p>
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
      type: Object,
      default: () => {},
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

  methods: {
    computeDate(date) {
      const curDate = new Date(date)
      const hours = curDate.getHours()
      const minutes = curDate.getMinutes()

      return `${hours}:${minutes}`
    },
  },
}
</script>