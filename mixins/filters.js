import {
  getAlreadyKnown,
  getByAmount,
  getByName,
  getByRating,
  getUnrated,
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
      /**
      * @todo
      we don't need reset all filters, when we turn one of them
      we need watch all filters and filter by all values
      we need array with applied filters
      * */
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
      const trimmedValue = trim(value)
      const users = this.filteredUsers

      const foundUsers = users.filter(el => {
        if (el.nickname && trim(el.nickname).includes(trimmedValue)) {
          return true
        }
        if (trim(el.name).includes(trimmedValue)) {
          return true
        }
        return false
      })
      if (trimmedValue.length) {
        this.users = foundUsers
      } else {
        this.users = this.filteredUsers
      }
    },

    getAll() {
      this.filteredUsers = this.startUsers

      this.users = this.filteredUsers
    },
    getUnrated() {
      this.users = getUnrated(this.startUsers)
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
