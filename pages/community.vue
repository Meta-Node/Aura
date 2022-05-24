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
        <app-spinner :is-visible="true" />
      </div>
      <div
        v-else
        class="community__users"
      >
        <h3 class="community__humans-title">Your Connections</h3>
        <div class="filter switch-wrapper">
          <filter-button
            name="Name"
            :is-icon="true"
            :active="nameFilter.active"
            :reverse="nameFilter.isReversed"
            @clicked="onFiltered('Name')"
          />
          <filter-button
            name="Rating"
            :is-icon="true"
            :active="ratingFilter.active"
            :reverse="ratingFilter.isReversed"
            @clicked="onFiltered('Rating')"
          />
          <filter-button
            name="Unrated"
            :is-icon="false"
            :active="unratedFilter.active"
            @clicked="onFiltered('Unrated')"
          />
          <custom-select
            v-model="recoveryLevelFilter"
            default="All"
            name="Recovery level"
            :options="['All', 'Just met', 'Already known']"
          ></custom-select>

        </div>
        <lazy-loading-items
          v-if="users.length"
          :items="users"
          @updateItems="onUpdateItems"
        >
          <ul class="user-v1-ul">
            <user-v-1
              v-for="user in visibleItems"
              :key="user.id"
              :is-brightness="true"
              :brightness="user.rating / 10"
              :img="user.id"
              :name="user.nickname || user.name"
              :url="`/profile/${user.id}`"
            />
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
import UserV1 from '~/components/users/UserV1.vue'
import FilterButton from '~/components/filters/FilterButton.vue'
export default {
  components: { AppSearch, LazyLoadingItems, UserV1, CustomSelect, FilterButton },
  mixins: [transition, users, loadItems],
  data() {
    return {
      recoveryLevelFilter: 'All',
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
    }
  },

  watch: {
    recoveryLevelFilter(value) {
      this.onFiltered('Recovery', value)
    }
  },

  methods: {
    onFiltered(name, value) {
      this.$refs.search.resetSearch()

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
      if (name === 'Recovery') {
        this.onRecoveryLevelChange(value)
      }

      const queries = this.$route.query

      this.$router.push({ query: { ...queries, filter: name } })

      this.filteredUsers = this.users

    },
    onNameClick() {
      this.ratingFilter = { active: false, isReversed: false }

      if (this.nameFilter.active) {
        this.nameFilter.isReversed = !this.nameFilter.isReversed
      } else {
        this.nameFilter.active = true
        this.nameFilter.isReversed = false
      }

      if (this.unratedFilter.active) {
        this.users = this.getAlreadyKnown(this.getUnrated(this.getName(this.startUsers, !this.nameFilter.isReversed)), this.recoveryLevelFilter)
      } else {
        this.users = this.getAlreadyKnown(this.getName(this.startUsers, !this.nameFilter.isReversed), this.recoveryLevelFilter)
      }
    },
    onRatingClick() {
      this.nameFilter = { active: false, isReversed: false }
      this.unratedFilter.active = false

      if (this.ratingFilter.active) {
        this.ratingFilter.isReversed = !this.ratingFilter.isReversed
      } else {
        this.ratingFilter.active = true
        this.ratingFilter.isReversed = false
      }
      this.users = this.getAlreadyKnown(this.getRating(this.startUsers, !this.ratingFilter.isReversed), this.recoveryLevelFilter)

    },
    onUnratedClick() {
      this.unratedFilter.active = !this.unratedFilter.active
      this.ratingFilter = { active: false, isReversed: false }


      if (this.unratedFilter.active) {

        if (this.nameFilter.active) {
          this.users = this.getAlreadyKnown(this.getUnrated(this.getName(this.startUsers, !this.nameFilter.isReversed)), this.recoveryLevelFilter)
          return
        }

        this.users = this.getAlreadyKnown(this.getUnrated(this.startUsers), this.recoveryLevelFilter)
      } else {
        this.users = this.getAlreadyKnown(this.startUsers, this.recoveryLevelFilter)
        this.ratingFilter = { active: false, isReversed: false }
        this.nameFilter = { active: false, isReversed: false }
      }
    },
    onRecoveryLevelChange(value) {

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
        this.ratingFilter = { active: false, isReversed: false }
        this.nameFilter = { active: false, isReversed: false }
      }
    }
  },


}
</script>