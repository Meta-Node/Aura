export default {
  data() {
    return {
      foundUsers: [],
      startUsers: [],
      users: [],
    }
  },

  mounted() {
    const connections = JSON.parse(localStorage.getItem('profileData') || '[]')
    this.startUsers = connections.connections
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
