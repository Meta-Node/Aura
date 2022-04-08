import { getRatedUsers } from '~/scripts/api/rate.service'

export default {
  data() {
    return {
      foundUsers: [],
      startUsers: [],
      users: [],
    }
  },

  async mounted() {
    const connections = this.$store.getters['profile/connections']

    if (this.$route.name === 'community') {
      this.startUsers = connections
      this.users = this.startUsers
      return
    }

    try {
      const ratedUsers = await getRatedUsers()
      const moreThanZero = ratedUsers.filter(user => +user.rating >= 1)
      const finalUsers = moreThanZero.map(user => {
        return {
          rating: +user.rating,
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
      this.foundUsers = this.startUsers.filter(el =>
        this.trim(el.name).includes(trimmedValue)
      )
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
