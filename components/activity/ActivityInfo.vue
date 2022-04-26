<template>
  <li class="activity__list">
    <div class="activity__main">
      <div v-if="isPersonal" class="activity__left-block">
        <toggle-switch :id="id" :is-active="isImportant" @toggle="onToggle" />
      </div>
      <div class="activity__right-block">
        <div class="activity__text">
          <span v-if="fromUser" class="activity__from-user">
            <nuxt-link :to="'/profile/' + fromUser.id">
              {{ fromUser.name }}
            </nuxt-link>
          </span>
          <span class="activity__action">
            {{ computeActivityAction(action.action) }}
          </span>
          <span v-if="toUser" class="activity__to-user">
            <nuxt-link :to="'/profile/' + toUser.id">
              {{ toUser.nickname || toUser.name }}
            </nuxt-link>
          </span>
          <span>{{ `(${action.amount})` }}</span>
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
    isImportant: {
      type: Boolean,
      default: false,
    },
    isPersonal: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    computeDate(date) {
      const activityDate = new Date(date)
      const todayDate = new Date(Date.now())
      const hours = activityDate.getHours()

      let minutes = activityDate.getMinutes()
      minutes = +minutes <= 9 ? `0${minutes}` : minutes

      const delta = Math.abs(todayDate - activityDate) / 1000
      const days = Math.floor(delta / 86400)

      if (days > 1) {
        return days + ' day(s) ago'
      }

      return `${hours}:${minutes}`
    },
    computeActivityAction(action) {
      if (action === 'RATED_CONNECTION') {
        return 'rated'
      }
      if (action === 'ENERGY_TRANSFER') {
        return 'transfered energy'
      }
      return action
    },
    onToggle(value) {
      this.$emit('toggle', { value, id: this.id })
    },
  },
}
</script>