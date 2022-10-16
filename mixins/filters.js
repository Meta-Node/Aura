import Vue from 'vue'
import {
  getAlreadyKnown,
  getByAmount,
  getByIncomingConnectionLevel,
  getByIncomingRatingToConnection,
  getByName,
  getByRating,
  getByRatingDate,
  getExcludeZeros,
  getRecentConnection,
  getUnrated,
  onSearch,
  trim,
} from '~/scripts/utils/filters'

function tryParse(key) {
  if (!process.client) return null
  const str = localStorage.getItem(key)
  if (!str) return null
  try {
    return JSON.parse(str)
  } catch (_e) {
    return null
  }
}

export default {
  data() {
    return {
      searchValue: '',
      filteredUsers: [],
      users: [],
      appliedFilters: [],
      filterKey: null,
    }
  },
  created() {
    const finalFilters = this.filters
    if (this.filterKey) {
      const filters = tryParse(this.filterKey)
      if (filters) {
        for (const filter of filters) {
          const existingFilter = this.filters.find(f => f.name === filter.name)
          if (existingFilter) {
            Vue.set(existingFilter, 'active', filter.active)
            Vue.set(existingFilter, 'reverse', filter.reverse)
          }
        }
      }
    }
    this.filters = finalFilters
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
        if (this.filterKey) {
          localStorage.setItem(this.filterKey, JSON.stringify(this.filters))
        }
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
    getRecentConnection(users, fromLess) {
      return getRecentConnection(users, fromLess)
    },
    getName(users, fromLess) {
      return getByName(users, fromLess)
    },
    getRating(users, fromLess) {
      return getByRating(users, fromLess)
    },
    getIncomingRatingToConnection(users, fromLess) {
      return getByIncomingRatingToConnection(users, fromLess)
    },
    getIncomingConnectionLevel(users, fromLess) {
      return getByIncomingConnectionLevel(users, fromLess)
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
