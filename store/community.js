export const state = () => ({
  connectionTypeFilter: 'All',
  nameFilter: {
    active: false,
    isReversed: false
  },
  ratingFilter: {
    active: false,
    isReversed: false
  },
  unratedFilter: {
    active: false
  }
})

export const mutations = {
  setConnectionTypeFilter(state, value) {
    state.connectionTypeFilter = value
  },
  setNameFilter(state, value) {
    state.nameFilter = value
  },
  setRatingFilter(state, value) {
    state.ratingFilter = value
  },
  setUnratedFilter(state, value) {
    state.unratedFilter = value
  },
}
