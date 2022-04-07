<template>
  <li class="activity__list">
    <div class="activity__main">
      <div class="activity__left-block">
        <toggle-switch :id="id" />
      </div>
      <div class="activity__right-block">
        <div class="activity__text">
          <span v-if="fromUser" class="activity__from-user"
            ><nuxt-link :to="'/profile/' + fromUser.id">{{
              fromUser.name
            }}</nuxt-link></span
          >
          <span class="activity__action">{{
            computeActivityAction(action.action, action.amount)
          }}</span>
          <span v-if="toUser" class="activity__to-user"
            ><nuxt-link :to="'/profile/' + toUser.id">{{
              toUser.name
            }}</nuxt-link></span
          >
        </div>
        <p class="activity__time">{{ computeDate(time) }}</p>
      </div>
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
      const activityDate = new Date(date)
      const todayDate = new Date(Date.now())
      const todayDay = todayDate.getDay()

      const day = activityDate.getDay()
      const hours = activityDate.getHours()

      let minutes = activityDate.getMinutes()
      minutes = +minutes <= 9 ? `0${minutes}` : minutes

      if (todayDay - day >= 1) {
        return todayDay - day + ' day(s) ago'
      }

      return `${hours}:${minutes}`
    },
    computeActivityAction(action, amount) {
      if (action === 'RATED_CONNECTION') {
        return 'rated ' + `(${amount})`
      }
      return action + ' ' + amount
    },
  },
}
</script>