<template>
  <section class="activity">
    <div class="container activity__wrapper">
      <h3 class="activity__title">Activity</h3>
      <div v-if="activityData.length">
        <ul class="activity__info">
          <activity-info
            v-for="activity in activityData"
            :id="activity.id"
            :key="activity.id"
            :from-user="activity.fromProfile"
            :action="activity.action"
            :to-user="activity.toProfile"
            :time="activity.timestamp"
          />
        </ul>
        <load-more text="Load More..." />
      </div>
      <div v-else style="margin-top: 40px">
        <app-spinner :is-visible="true" />
      </div>
    </div>
  </section>
</template>

<script>
import ActivityInfo from '~/components/ActivityInfo.vue'
import AppSpinner from '~/components/AppSpinner.vue'
import { getProfileActivity } from '~/scripts/api/activity.service'

export default {
  components: { ActivityInfo, AppSpinner },
  data() {
    return {
      activityData: [],
    }
  },
  async mounted() {
    const profileData = JSON.parse(localStorage.getItem('profileData') || '[]')
    const brightId = profileData?.profile?.id
    if (!brightId) {
      return
    }

    const res = await getProfileActivity(brightId)
    const events = res?.data?.events

    if (!events) {
      return
    }

    this.activityData = events
      .map(event => {
        event = {
          ...event,
          fromProfile: profileData.profile,
          toProfile: profileData.connections.find(
            con => con.id === event.toBrightId
          ),
        }
        return event
      })
      .reverse()
  },
}
</script>