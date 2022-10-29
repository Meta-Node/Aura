import filtersMixin from '~/mixins/filters'

export default {
  mixins: [filtersMixin],
  data() {
    return {
      startUsers: [],
      isLoading: false,
    }
  },

  computed: {
    transferedEnergy() {
      return this.$store.state.energy.transferedEnergy
    },
    inboundEnergy() {
      return this.$store.state.energy.inboundEnergy
    },
    connections() {
      return this.$store.getters['profile/connections']
    },
  },
  methods: {
    async loadUserProfile() {
      // await this.$store.dispatch('connections/getConnectionsData')
      await this.$store.dispatch('profile/getProfileData')
    },
    async getUserData() {
      try {
        this.isLoading = true
        await this.loadUserProfile()
        this.startUsers = this.connections
        this.setInitialFilter()
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
  },

  mounted() {
    this.getUserData()
  },
}
