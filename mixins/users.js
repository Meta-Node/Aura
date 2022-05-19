import { getRatedUsers } from '~/scripts/api/rate.service'
import {
  getAlreadyKnown,
  getByAmount,
  getByName,
  getByRating,
  getUnrated,
} from '~/scripts/utils/filters'

export default {
  data() {
    return {
      startUsers: [],
      filteredUsers: [],
      users: [],
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

  async mounted() {
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

      try {
        const ratedUsers = await getRatedUsers()
        await this.$store.dispatch('energy/getTransferedEnergy')
        await this.$store.dispatch('energy/getInboundEnergy')

        const moreThanZero = ratedUsers.filter(user => +user.rating >= 1)

        const finalUsers = moreThanZero.map(user => {
          return {
            rating: +user.rating,
            transferedEnergy: this.transferedEnergy.find(
              en => en.toBrightId === user.toBrightId
            ).amount,
            inboundEnergy:
              this.inboundEnergy.find(en => en.fromBrightId === user.toBrightId)
                ?.amount || 0,
            ...this.connections.find(conn => conn.id === user.toBrightId),
          }
        })

        this.startUsers = finalUsers
      } catch (error) {
        console.log(error)
      }
      this.users = this.startUsers

      this.onFiltered(this.$route.query?.filter || 'All')
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    onFiltered(name) {
      this.$refs.search.resetSearch()

      this.users = this.startUsers
      this.filters = this.filters.map(filter => {
        if (filter.name === name) {
          if (filter.isIcon) {
            if (!filter.active) {
              filter.reverse = false
            } else {
              filter.reverse = !filter.reverse
            }
          }
          filter.active = true
        } else {
          filter.active = false
        }
        return filter
      })

      const queries = this.$route.query

      this.$router.push({ query: { ...queries, filter: name } })

      const fromLess = !this.filters.find(f => f.name === name)?.reverse
      this[`get${name.replace(' ', '')}`](fromLess)

      this.filteredUsers = this.users
    },
    onSearchValue(value) {
      const trimmedValue = this.trim(value)
      const users = this.filteredUsers

      const foundUsers = users.filter(el => {
        if (el.nickname && this.trim(el.nickname).includes(trimmedValue)) {
          return true
        }
        if (this.trim(el.name).includes(trimmedValue)) {
          return true
        }
        return false
      })
      if (trimmedValue.length) {
        this.users = foundUsers
      } else {
        this.users = this.startUsers
      }
    },
    trim(str) {
      return str.trim().toLowerCase()
    },
    getAll() {
      this.filteredUsers = this.startUsers

      this.users = this.filteredUsers
    },
    getUnrated() {
      const unratedUsers = getUnrated(this.startUsers)

      this.filteredUsers = unratedUsers
      this.users = this.filteredUsers
    },
    getName(fromLess) {
      this.users = getByName(this.startUsers, fromLess)
    },
    getRating(fromLess) {
      this.users = getByRating(this.startUsers, fromLess)
    },
    getAmount(fromLess) {
      this.users = getByAmount(this.startUsers, fromLess)
    },
    getAlreadyKnown() {
      this.users = getAlreadyKnown(this.startUsers)
    },
  },
}
