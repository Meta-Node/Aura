import Vue from 'vue'
import {
  getAlreadyKnown,
  getAlreadyKnownPlus,
  getByAmount,
  getByIncomingConnectionLevel,
  getByIncomingRatingToConnection,
  getByName,
  getByRating,
  getByRatingDate,
  getExcludeZeros,
  getJustMet,
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
      defaultFilter: 'All',
    }
  },
  created() {
    if (this.filterKey) {
      const filters = tryParse(this.filterKey)
      if (filters) {
        for (const filter of filters) {
          if (filter.type === 'select') {
            for (const nestedFilter of filter.options) {
              this.setFilterFromLocalStorageData(nestedFilter)
            }
          }
          this.setFilterFromLocalStorageData(filter)
        }
      }
    }
  },
  methods: {
    setFilterFromLocalStorageData(filterData) {
      const existingFilter = this.findFilterByName(filterData.name)
      if (existingFilter) {
        Vue.set(existingFilter, 'active', filterData.active)
        Vue.set(existingFilter, 'reverse', filterData.reverse)
      }
    },
    findFilterByName(name) {
      let filterObj = null
      for (const filter of this.filters) {
        if (filter.type === 'select') {
          for (const nestedFilter of filter.options) {
            if (nestedFilter.name === name) {
              filterObj = nestedFilter
              break
            }
          }
        }
        if (filter.name === name) {
          filterObj = filter
        }
        if (filterObj) break
      }
      return filterObj
    },
    onFiltered(name) {
      this.users = this.startUsers

      const filterObj = this.findFilterByName(name)

      function toggleFilter(filter) {
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
      }

      function deactivateFilter(filter) {
        filter.active = false
        if (filter.type === 'ordering') {
          filter.reverse = filter.defaultAscending
        }
      }

      if (name) {
        const filterType = filterObj?.type
        this.filters = this.filters.map(filter => {
          if (filter.type === 'select') {
            filter.options = filter.options.map(nestedFilter => {
              if (nestedFilter.name === name) {
                toggleFilter(nestedFilter)
              } else if (nestedFilter.type === filterType) {
                deactivateFilter(nestedFilter)
              }
              return nestedFilter
            })
          } else if (filter.name === name) {
            toggleFilter(filter)
          } else if (filter.type === filterType) {
            deactivateFilter(filter)
          }
          return filter
        })
        if (this.filterKey) {
          localStorage.setItem(this.filterKey, JSON.stringify(this.filters))
        }
      }

      const activeFilter = this.getActiveFilter()

      const filterName = activeFilter?.name || this.defaultFilter

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
    setInitialFilter() {
      this.users = this.startUsers
      const activeFilter = this.getActiveFilter()

      if (activeFilter) {
        this.onFiltered()
      } else {
        this.onFiltered(this.defaultFilter)
      }
    },
    getActiveFilter() {
      let activeFilter = null
      for (const filter of this.filters) {
        if (filter.type === 'select') {
          for (const nestedFilter of filter.options) {
            if (nestedFilter.type !== 'ordering' && nestedFilter.active) {
              activeFilter = nestedFilter
            }
          }
        }
        if (filter.type !== 'ordering' && filter.active) {
          activeFilter = filter
        }
        if (activeFilter) break
      }
      return activeFilter
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
    getAllMutual() {
      this.filteredUsers = [...this.startUsers].sort((a, _b) =>
        a.alertDifference ? -1 : 1
      )

      return this.filteredUsers
    },
    getAll() {
      this.filteredUsers = this.startUsers

      return this.filteredUsers
    },
    getAllConnections() {
      return this.getAll()
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
    getAlreadyKnownPlus(users, value) {
      return getAlreadyKnownPlus(users, value)
    },
    getJustMet(users, value) {
      return getJustMet(users, value)
    },
    getExcludeZeros(users, value) {
      return getExcludeZeros(users, value)
    },
  },
}
