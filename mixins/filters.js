import {
  getAlreadyKnown,
  getByAmount,
  getByName,
  getByRating,
  getByRatingDate,
  getExcludeZeros,
  getUnrated,
  onSearch,
  trim,
} from '~/scripts/utils/filters'

export default {
  data() {
    return {
      filteredUsers: [],
      users: [],
      appliedFilters: [],
    }
  },
  methods: {
    onFiltered(name) {
      this.$refs.search.resetSearch()

      this.users = this.startUsers
      this.filters = this.filters.map(filter => {
        if (filter.name === name) {
          if (filter.type === 'reversable') {
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
      this.users = this[`get${name.replace(' ', '')}`](
        this.startUsers,
        fromLess
      )

      this.filteredUsers = this.users
      this.onSearchValue('')
    },

    onSearchValue(value) {
      const trimmedValue = trim(value)

      let usersBase = this.filteredUsers
      if (this.$route.name === 'energy') {
        if (trimmedValue) {
          usersBase = usersBase.filter(
            user => !user.rating || +user.rating >= 1
          )
        } else {
          usersBase = usersBase.filter(user => +user.rating >= 1)
        }
      }
      this.users = onSearch(trimmedValue, usersBase)
    },

    getAll() {
      this.filteredUsers = this.startUsers

      return this.filteredUsers
    },
    getUnrated(users) {
      return getUnrated(users)
    },
    getName(users, fromLess) {
      return getByName(users, fromLess)
    },
    getRating(users, fromLess) {
      return getByRating(users, fromLess)
    },
    getRecent(users, fromLess) {
      return getByRatingDate(users, fromLess)
    },
    getOutbound(users, fromLess) {
      return getByAmount(users, fromLess)
    },
    getAmount(users, fromLess) {
      return getByAmount(users, fromLess)
    },
    getRated(users, fromLess) {
      return this.getRating(users, fromLess)
    },
    getAlreadyKnown(users, value) {
      return getAlreadyKnown(users, value)
    },
    getExcludeZeros(users, value) {
      return getExcludeZeros(users, value)
    },
  },
}
