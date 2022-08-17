<template>
  <section class="community">
    <div class="container community__wrapper">
      <div class="community__search">
        <h3 class="community__search-title">Find A Connection</h3>
        <app-search
          ref="search"
          @searchValue="onSearchValue"
        />
      </div>
      <div
        v-if="isLoading"
        style="margin-top: 40px"
      >
        <app-spinner :is-visible="true"/>
      </div>
      <div
        v-else
        class="community__users"
      >
        <h3 class="community__humans-title">Your Connections</h3>
        <div class="filter switch-wrapper">
          <filter-button
            :active="nameFilter.active"
            :is-icon="true"
            :reverse="nameFilter.isReversed"
            name="Name"
            @clicked="onFiltered('Name')"
          />
          <filter-button
            :active="ratingFilter.active"
            :is-icon="true"
            :reverse="ratingFilter.isReversed"
            name="Rating"
            @clicked="onFiltered('Rating')"
          />
          <filter-button
            :active="unratedFilter.active"
            :is-icon="false"
            :ordering="false"
            name="Unrated"
            @clicked="onFiltered('Unrated')"
          />
          <custom-select
            v-model="connectionTypeFilter"
            :options="['All', 'Just met', 'Aready known+']"
            default="All"
            name="Connection Type"
          ></custom-select>

        </div>
        <lazy-loading-items
          v-if="users.length"
          :items="users"
          @updateItems="onUpdateItems"
        >
          <ul class="user-item__list">
            <li v-for="(user, index) in visibleItems"
                :key="user.id"
                class="user-item__container"
            >
              <user-item-info :index="index" :user="user"></user-item-info>
            </li>
          </ul>
        </lazy-loading-items>
        <span
          v-else
          class="users-not-found"
        >Users not found</span>
      </div>
    </div>
  </section>
</template>

<script>
import CustomSelect from '../components/CustomSelect.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'
import loadItems from '~/mixins/loadItems'
import AppSearch from '~/components/AppSearch.vue'

import LazyLoadingItems from '~/components/LazyLoadingItems.vue'
import FilterButton from '~/components/filters/FilterButton.vue'
import UserItemInfo from '~/components/users/UserItemInfo'

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
  components: {AppSearch, LazyLoadingItems, UserItemInfo, CustomSelect, FilterButton},
  mixins: [transition, users, loadItems],
  data() {
    return {
      connectionTypeFilterData:
        (process.client && localStorage.getItem('connectionTypeFilter')) || 'All',
      nameFilterData: {
        ...(tryParse('nameFilter') || {
          active: false,
          isReversed: false,
        }),
        ordering: true
      },
      ratingFilterData: {
        ...(tryParse('ratingFilter') || {
          active: false,
          isReversed: false,
        }),
        ordering: true
      },
      unratedFilterData: {
        ...(tryParse('unratedFilter') || {
          active: false,
        }),
        ordering: false,
      },
    }
  },
  head() {
    return {
      title: `Aura | Community`,
    }
  },
  computed: {
    finalUsers() {
      return this.getUnrated(this.users)
    },
    connectionTypeFilter: {
      get() {
        return this.connectionTypeFilterData
      },
      set(value) {
        if (process.client) localStorage.setItem('connectionTypeFilter', value)
        this.connectionTypeFilterData = value
      }
    },
    nameFilter: {
      get() {
        return this.nameFilterData
      },
      set(value) {
        if (process.client)
          localStorage.setItem('nameFilter', JSON.stringify(value))
        this.nameFilterData = value
      }
    },
    ratingFilter: {
      get() {
        return this.ratingFilterData
      },
      set(value) {
        if (process.client)
          localStorage.setItem('ratingFilter', JSON.stringify(value))
        this.ratingFilterData = value
      }
    },
    unratedFilter: {
      get() {
        return this.unratedFilterData
      },
      set(value) {
        if (process.client)
          localStorage.setItem('unratedFilter', JSON.stringify(value))
        this.unratedFilterData = value
      }
    },
  },

  watch: {
    connectionTypeFilter(value) {
      this.onFiltered('ConnectionType', value)
    },
  },
  mounted() {
    this.onFiltered('ConnectionType', this.connectionTypeFilter)
  },

  methods: {
    onFiltered(name, value) {
      this.$refs.search?.resetSearch()

      if (name === 'All') {
        this.users = this.startUsers
      }

      if (name === 'Name') {
        this.onNameClick()

      }
      if (name === 'Rating') {
        this.onRatingClick()

      }
      if (name === 'Unrated') {
        this.onUnratedClick()

      }
      if (name === 'ConnectionType') {
        this.onConnectionTypeChange(value)
      }

      // const queries = this.$route.query
      //
      // this.$router.push({query: {...queries, filter: name}})

      this.filteredUsers = this.users

    },
    onNameClick() {
      this.ratingFilter = {active: false, isReversed: false}

      if (this.nameFilter.active) {
        this.nameFilter = {
          ...this.nameFilter,
          isReversed: !this.nameFilter.isReversed,
        }
      } else {
        this.nameFilter = {
          active: true,
          isReversed: false
        }
      }

      if (this.unratedFilter.active) {
        this.users = this.getAlreadyKnown(this.getUnrated(this.getName(this.startUsers, !this.nameFilter.isReversed)), this.connectionTypeFilter)
      } else {
        this.users = this.getAlreadyKnown(this.getName(this.startUsers, !this.nameFilter.isReversed), this.connectionTypeFilter)
      }
    },
    onRatingClick() {
      this.nameFilter = {active: false, isReversed: false}
      this.unratedFilter = {
        ...this.unratedFilter,
        active: false
      }

      if (this.ratingFilter.active) {
        this.ratingFilter = {
          ...this.ratingFilter,
          isReversed: !this.ratingFilter.isReversed
        }
      } else {
        this.ratingFilter = {
          active: true,
          isReversed: false
        }
      }
      this.users = this.getAlreadyKnown(this.getRating(this.startUsers, !this.ratingFilter.isReversed), this.connectionTypeFilter)

    },
    onUnratedClick() {
      this.unratedFilter = {
        ...this.unratedFilter,
        active: !this.unratedFilter.active
      }
      this.ratingFilter = {active: false, isReversed: false}


      if (this.unratedFilter.active) {

        if (this.nameFilter.active) {
          this.users = this.getAlreadyKnown(this.getUnrated(this.getName(this.startUsers, !this.nameFilter.isReversed)), this.connectionTypeFilter)
          return
        }

        this.users = this.getAlreadyKnown(this.getUnrated(this.startUsers), this.connectionTypeFilter)
      } else {
        this.users = this.getAlreadyKnown(this.startUsers, this.connectionTypeFilter)
        this.ratingFilter = {active: false, isReversed: false}
        this.nameFilter = {active: false, isReversed: false}
      }
    },
    onConnectionTypeChange(value) {

      if (this.unratedFilter.active) {
        if (this.nameFilter.active) {
          this.users = this.getAlreadyKnown(this.getUnrated(this.getName(this.startUsers, !this.nameFilter.isReversed)), value)
          return
        }
        if (this.ratingFilter.active) {
          this.users = this.getAlreadyKnown(this.getUnrated(this.getRating(this.startUsers, !this.ratingFilter.isReversed)), value)
          return
        }
        this.users = this.getAlreadyKnown(this.getUnrated(this.startUsers), value)
      } else {

        if (this.nameFilter.active) {
          this.users = this.getAlreadyKnown(this.getName(this.startUsers, !this.nameFilter.isReversed), value)
          return
        }
        if (this.ratingFilter.active) {
          this.users = this.getAlreadyKnown(this.getRating(this.startUsers, !this.ratingFilter.isReversed), value)
          return
        }
        this.users = this.getAlreadyKnown(this.startUsers, value)
        this.ratingFilter = {active: false, isReversed: false}
        this.nameFilter = {active: false, isReversed: false}
      }
    }
  }

}
</script>
