import { getRatedUsers } from '~/scripts/api/rate.service'
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
    async getUserData() {
      try {
        this.isLoading = true
        await this.$store.dispatch('connections/getConnectionsData')
        await this.$store.dispatch('profile/getProfileData')

        if (this.$route.name === 'community') {
          this.startUsers = this.connections
          this.users = this.startUsers
          this.onFiltered(this.$route.query?.filter || 'All')
          return
        }

        const ratedUsers = await getRatedUsers()
        await this.$store.dispatch('energy/getTransferedEnergy')
        await this.$store.dispatch('energy/getInboundEnergy')

        // const moreThanZero = ratedUsers.filter(user => +user.rating >= 1)

        const finalUsers = this.connections.map(conn => {
          const ratedUser = ratedUsers.find(user => user.toBrightId === conn.id)
          return {
            rating: ratedUser ? +ratedUser.rating : undefined,
            transferedEnergy:
              this.transferedEnergy.find(en => en.toBrightId === conn.id)
                ?.amount || 0,
            inboundEnergy:
              this.inboundEnergy.find(en => en.fromBrightId === conn.id)
                ?.amount || 0,
            ...conn,
          }
        })

        this.startUsers = finalUsers

        this.users = this.startUsers

        this.onFiltered(this.$route.query?.filter || 'All')
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
