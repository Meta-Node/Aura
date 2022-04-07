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
    const connections = JSON.parse(localStorage.getItem('profileData') || '[]')
    try {
      const ratedUsers = await getRatedUsers()
      const moreThanZero = ratedUsers.filter(user => +user.rating > 0.5)
      const finalUsers = moreThanZero.map(user => {
        return {
          rating: +user.rating,
          ...connections.connections.find(conn => conn.id === user.toBrightId),
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
