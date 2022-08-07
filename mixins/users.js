import { getRatedUsers } from '~/scripts/api/rate.service'
import filtersMixin from '~/mixins/filters'
import { toRoundedPercentage } from '~/utils/numbers'

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
          if (this.connectionTypeFilter) {
            this.onFiltered('ConnectionType', this.connectionTypeFilter)
          } else {
            this.onFiltered(this.$route.query?.filter || 'All')
          }
          return
        }

        const ratedUsers = await getRatedUsers()
        await this.$store.dispatch('energy/getTransferedEnergy')
        await this.$store.dispatch('energy/getInboundEnergy')

        const finalUsers = this.connections.map(conn => {
          const ratingData = ratedUsers.find(
            user => user.toBrightId === conn.id
          )
          const inboundEnergyObject = this.inboundEnergy.find(
            en => en.fromBrightId === conn.id
          )
          return {
            ratingData,
            rating: ratingData ? +ratingData.rating : undefined,
            transferedEnergy:
              this.transferedEnergy.find(en => en.toBrightId === conn.id)
                ?.amount || 0,
            inboundEnergyPercentage: inboundEnergyObject
              ? toRoundedPercentage(
                  inboundEnergyObject.amount,
                  inboundEnergyObject.scale
                )
              : 0,
            ...conn,
          }
        })

        this.startUsers = finalUsers

        this.users = this.startUsers

        const activeFilter = this.filters?.find(
          filter => filter.type !== 'ordering' && filter.active
        )
        if (activeFilter) {
          this.onFiltered()
        } else {
          this.onFiltered(this.$route.query?.filter || 'All')
        }
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
