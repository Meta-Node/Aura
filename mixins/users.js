export default {
  data() {
    return {
      foundUsers: [],
      users: [],
    }
  },
  computed: {
    startUsers() {
      return this.$store.state.users.users
    },
  },
  async mounted() {
    await this.$store.dispatch('users/getUsers')
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
