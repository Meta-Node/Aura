import {
  getGlobalActivity,
  getProfileActivity,
  setImportantActivity,
} from '~/scripts/api/activity.service'

export default {
  data() {
    return {
      activityData: [],
      startedActivityData: [],
      isLoading: true,
      filters: [
        {
          name: 'All',
          isIcon: false,
          active: false,
          reverse: false,
        },
        {
          name: 'Important',
          isIcon: false,
          active: false,
          reverse: false,
        },
      ],
    }
  },

  async mounted() {
    try {
      this.isLoading = true
      const isPersonal =
        this.$route.query.tab === 'Personal' || !this.$route.query.tab
      isPersonal
        ? await this.getPersonalActivity()
        : await this.getGlobalActivity()

      if (this.$route.query.filter) {
        this.onFiltered(this.$route.query.filter)
      } else {
        this.onFiltered('All')
      }
    } catch (error) {
      this.$store.commit('toast/addToast', { text: 'Error', color: 'danger' })
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    async getPersonalActivity() {
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

      this.startedActivityData = events
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
    },
    async getGlobalActivity() {
      await this.$store.dispatch('connections/getConnectionsData')
      await this.$store.dispatch('profile/getProfileData')
      const connections = this.$store.getters['profile/connections']
      const profile = this.$store.getters['profile/profileData']
      const brightId = profile?.id

      if (!brightId) {
        return
      }

      const res = await getGlobalActivity()
      const events = res?.data?.events

      if (!events) {
        return
      }

      this.startedActivityData = events
        .map(event => {
          const toProfile =
            event.toBrightId === profile.id
              ? profile
              : connections.find(con => con.id === event.toBrightId)
          event = {
            ...event,
            fromProfile: connections.find(con => con.id === event.fromBrightId),
            toProfile,
          }
          return event
        })
        .filter(event => event.toProfile)
        .filter(event => event.fromProfile)
        .reverse()
    },
    onFiltered(name) {
      this.filters = this.filters.map(filter => {
        if (filter.name === name) {
          filter.active = !filter.active
        } else {
          filter.active = false
        }
        return filter
      })

      const query = { ...this.$route.query }
      if (name !== 'All') {
        this.$router.push({ query: { ...query, filter: name } })
      } else {
        delete query.filter
        this.$router.push({ query: { ...query } })
      }

      if (name === 'All') {
        this.activityData = this.startedActivityData
      }
      if (name === 'Important') {
        this.activityData = this.startedActivityData.filter(
          ad => ad.isimportant
        )
      }
    },
    async onToggle(data) {
      await setImportantActivity(data.id, data.value)
    },
  },
}
