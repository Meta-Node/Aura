<template>
  <div v-if="isLoading" style="margin-top: 40px">
    <app-spinner :is-visible="true" />
  </div>
  <div v-else-if="activityData.length" class="activity__data">
    <small class="activity__tab-name">Not important / Important</small>
    <ul class="activity__info">
      <activity-info
        v-for="activity in activityData"
        :id="activity.id"
        :key="activity.id"
        :is-important="activity.isimportant"
        :from-user="activity.fromProfile"
        :action="activity.action"
        :to-user="activity.toProfile"
        :time="activity.timestamp"
        @toggle="onToggle"
      />
    </ul>
    <!-- <load-more text="Load More..." /> -->
  </div>
  <div v-else style="margin: 0 auto; text-align: center; margin-top: 20px">
    You have not been active yet
  </div>
</template>

<script>
import ActivityInfo from '~/components/activity/ActivityInfo.vue'
import {
  getProfileActivity,
  setImportantActivity,
} from '~/scripts/api/activity.service'

export default {
  components: { ActivityInfo },
  data() {
    return {
      activityData: [],
      isLoading: true,
    }
  },
  async mounted() {
    try {
      this.isLoading = true
      await this.$store.dispatch('connections/getConnectionsData')
      await this.$store.dispatch('profile/getProfileData')
      const connections = this.$store.getters['profile/connections']
      const profile = this.$store.getters['profile/profileData']
      const brightId = profile?.id

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
            fromProfile: profile,
            toProfile: connections.find(con => con.id === event.toBrightId),
          }
          return event
        })
        .filter(event => event.toProfile)
        .reverse()
    } catch (error) {
      this.$store.commit('toast/addToast', { text: 'Error', color: 'danger' })
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    async onToggle(data) {
      await setImportantActivity(data.id, data.value)
    },
  },
}
</script>