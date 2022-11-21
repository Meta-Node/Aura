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
    transferredEnergy() {
      return this.$store.state.energy.transferredEnergy
    },
    inboundEnergy() {
      return this.$store.state.energy.inboundEnergy
    },
    connections() {
      return this.$store.getters['profile/connections']
    },
  },
  methods: {
    async refreshConnections() {
      try {
        this.isLoading = true
        await this.$store.dispatch('profile/refreshLocalForageBrightIdBackup')
        await this.getUserData()
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },
    loadUserProfile() {
      return this.$store.dispatch('profile/loadProfileData')
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
