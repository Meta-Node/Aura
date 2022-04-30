import { getRatedUsers } from '~/scripts/api/rate.service'

export default {
  data() {
    return {
      foundUsers: [],
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
        if (this.$route.query.filter) {
          this.onFiltered(this.$route.query.filter)
        }
        return
      }

      try {
        const ratedUsers = await getRatedUsers()
        await this.$store.dispatch('energy/getTransferedEnergy')

        const moreThanZero = ratedUsers.filter(user => +user.rating >= 1)

        const finalUsers = moreThanZero.map(user => {
          return {
            rating: +user.rating,
            transferedEnergy: this.transferedEnergy.find(
              en => en.toBrightId === user.toBrightId
            ).amount,
            ...this.connections.find(conn => conn.id === user.toBrightId),
          }
        })

        this.startUsers = finalUsers
      } catch (error) {
        console.log(error)
      }
      this.users = this.startUsers
      if (this.$route.query.filter) {
        this.onFiltered(this.$route.query.filter)
      }
    } catch (error) {
      console.log(error)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    onFiltered(name) {
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

      if (name === 'All') {
        this.getAll()
      }
      if (name === 'Unrated') {
        this.getUnrated()
      }

      if (name === 'Name') {
        const fromA = !this.filters.find(f => f.name === name).reverse
        this.getByName(fromA)
      }

      if (name === 'Rating') {
        const fromLess = !this.filters.find(f => f.name === name).reverse
        this.getByRating(fromLess)
      }

      if (name === 'Amount') {
        const fromLess = !this.filters.find(f => f.name === name).reverse
        this.getByAmount(fromLess)
      }
    },
    onSearchValue(value) {
      const trimmedValue = this.trim(value)
      const users = this.filteredUsers.length
        ? this.filteredUsers
        : this.startUsers

      this.foundUsers = users.filter(el => {
        if (el.nickname && this.trim(el.nickname).includes(trimmedValue)) {
          return true
        }
        if (this.trim(el.name).includes(trimmedValue)) {
          return true
        }
        return false
      })
      if (trimmedValue.length) {
        this.users = this.foundUsers
      } else {
        this.users = users
      }
    },
    trim(str) {
      return str.trim().toLowerCase()
    },
    getUnrated() {
      const unratedUsers = this.startUsers.filter(user => !user.rating)

      this.filteredUsers = unratedUsers
      this.users = this.filteredUsers
    },

    getAll() {
      this.filteredUsers = this.startUsers

      this.users = this.filteredUsers
    },

    getByRating(fromLess) {
      this.filteredUsers = [...this.startUsers.filter(su => su.rating)].sort(
        (a, b) => +a.rating - b.rating
      )
      if (fromLess) {
        this.users = this.filteredUsers
      } else {
        this.users = this.filteredUsers.reverse()
      }
    },
    getByAmount(fromLess) {
      this.filteredUsers = [
        ...this.startUsers.filter(su => su.transferedEnergy),
      ].sort((a, b) => +a.transferedEnergy - b.transferedEnergy)
      if (fromLess) {
        this.users = this.filteredUsers.reverse()
      } else {
        this.users = this.filteredUsers
      }
    },
    getByName(fromA) {
      this.filteredUsers = [...this.startUsers].sort(function (a, b) {
        const aName = a.nickname || a.name
        const bName = b.nickname || b.name
        if (aName > bName) {
          return 1
        }
        if (bName > aName) {
          return -1
        }
        return 0
      })

      if (fromA) {
        this.users = this.filteredUsers
      } else {
        this.users = this.filteredUsers.reverse()
      }
    },
  },
}
