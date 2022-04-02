<template>
  <section class="activity">
    <div class="container activity__wrapper">
      <h3 class="activity__title">Activity</h3>
      <ul class="activity__info">
        <activity-info
          v-for="(user, idx) in 9"
          :id="idx"
          :key="idx"
          :from-user="activityData.fromUser"
          :action="activityData.action"
          :to-user="activityData.toUser"
          time="04:25 p.m."
        />
      </ul>
      <text-button text="Load More..." />
    </div>
  </section>
</template>

<script>
import ActivityInfo from '~/components/ActivityInfo.vue'

export default {
  components: { ActivityInfo },
  data() {
    return {
      activityData: {
        fromUser: {
          name: 'Valera',
          url: '/',
        },
        action: 'charge 20% enegry to',
        toUser: {
          name: 'Leonid',
          url: '/',
        },
      },
    }
  },
}
</script>