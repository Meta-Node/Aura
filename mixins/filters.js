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
      searchValue: '',
      filteredUsers: [],
      users: [],
      appliedFilters: [],
    }
  },
  methods: {
    onFiltered(name) {
      this.users = this.startUsers

      if (name) {
        const filterType = this.filters.find(
          filter => filter.name === name
        )?.type
        this.filters = this.filters.map(filter => {
          if (filter.name === name) {
            if (filter.type === 'ordering') {
              if (!filter.active) {
                filter.active = true
                filter.reverse = filter.defaultAscending
              } else {
                filter.reverse = !filter.reverse
              }
            } else {
              filter.active = !filter.active
            }
          } else if (filter.type === filterType) {
            filter.active = false
            if (filter.type === 'ordering') {
              filter.reverse = filter.defaultAscending
            }
          }
          return filter
        })
        localStorage.setItem('filters', JSON.stringify(this.filters))
      }

      const activeFilter = this.filters.find(
        filter => filter.type !== 'ordering' && filter.active
      )
      const filterName = activeFilter?.name || 'All'

      const queries = this.$route.query
      this.$router.push({ query: { ...queries, filter: filterName } })

      const fromLess = !activeFilter?.reverse
      let newUsers = this[`get${filterName.replace(' ', '')}`](
        this.startUsers,
        fromLess
      )

      const activeOrder = this.filters.find(
        filter => filter.type === 'ordering' && filter.active
      )
      if (activeOrder) {
        const orderName = activeOrder.name
        newUsers = this[`get${orderName.replace(' ', '')}`](
          newUsers,
          !activeOrder.reverse
        )
      }

      this.users = newUsers
      this.filteredUsers = this.users
      // if there is activeOrder or activeFilter, clear the search bar
      this.onSearchValue(activeOrder || activeFilter ? '' : this.searchValue)
    },

    onSearchValue(value) {
      this.searchValue = value
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
