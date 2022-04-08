import { getRatedUsers } from '~/scripts/api/rate.service'

export default {
  data() {
    return {
      foundUsers: [],
      startUsers: [],
      users: [],
    }
  },

  computed: {
    transferedEnergy() {
      return this.$store.state.energy.transferedEnergy
    },
  },

  async mounted() {
    await this.$store.dispatch('connections/getConnectionsData')
    await this.$store.dispatch('profile/getProfileData')
    const connections = this.$store.getters['profile/connections']

    if (this.$route.name === 'community') {
      this.startUsers = connections
      this.users = this.startUsers
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
          ...connections.find(conn => conn.id === user.toBrightId),
        }
      })

      this.startUsers = finalUsers
    } catch (error) {
      console.log(error)
    }
    this.users = this.startUsers
  },
  methods: {
    onSearchValue(value) {
      const trimmedValue = this.trim(value)
      this.foundUsers = this.startUsers.filter(el => {
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
        this.users = this.startUsers
      }
    },
    trim(str) {
      return str.trim().toLowerCase()
    },
  },
}
