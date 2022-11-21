<template>
  <div>
    <div
      v-if="isLoading"
      style="margin-top: 40px"
    >
      <app-spinner :is-visible="true"/>
    </div>
    <div
      v-else
      class="mutual-connections__users"
    >
      <h3 class="mutual-connections__title">Mutual Connections</h3>
      <div class="filter switch-wrapper">
        <app-filter :filters="filters" @clearFilters="clearFilters" @filtered="onFiltered"/>
      </div>
      <lazy-loading-items
        v-if="users.length"
        :items="users"
        @updateItems="onUpdateItems"
      >
        <small class="app-explorer__table-name" style="margin-top: 30px">Opinion about {{ profile.name }}</small>
        <ul class="user-item__list" style="margin-top: 0px">
          <li v-for="(user, index) in visibleItems"
              :key="user.id"
              class="user-item__container"
          >
            <mutual-connection :index="index" :user="user"></mutual-connection>
          </li>
        </ul>
      </lazy-loading-items>
      <span
        v-else
        class="users-not-found"
      >Users not found</span>
    </div>
  </div>
</template>

<script>
import transition from '~/mixins/transition'
import users from '~/mixins/users'
import loadItems from '~/mixins/loadItems'

import LazyLoadingItems from '~/components/LazyLoadingItems.vue'
import AppFilter from '~/components/filters/AppFilter.vue'
import MutualConnection from '~/components/users/MutualConnection'


const filterKey = 'mutualConnectionFilters'
export default {
  components: {
    LazyLoadingItems, MutualConnection,
    // CustomSelect,
    AppFilter
  },
  mixins: [transition, users, loadItems],
  props: {
    profile: {
      type: Object,
    },
    loadingProfileData: {
      type: Boolean,
    },
    profileCallsDone: {
      type: Number,
    },
    profileIncomingConnections: {
      type: Array,
    },
    profileInboundEnergy: {
      type: Array,
    },
    profileTransferredEnergy: {
      type: Array,
    },
    profileRatedUsers: {
      type: Array,
    },
    profileIncomingRatings: {
      type: Array,
    },
  },
  data() {
    return {
      setDataCalled: false,
      isLoading: true,
      filterKey,
      filters: [
        {
          name: 'Name',
          type: 'ordering',
          defaultAscending: true,
          active: false,
          reverse: true,
        },
        {
          name: 'Rated',
          type: 'ordering',
          label: 'My Rating',
          defaultAscending: false,
          active: false,
          reverse: false,
        },
        {
          name: 'IncomingRatingToConnection',
          type: 'ordering',
          label: 'Their Rating',
          defaultAscending: false,
          active: false,
          reverse: false,
        },
        {
          name: 'IncomingConnectionLevel',
          type: 'ordering',
          label: 'Connection Level',
          defaultAscending: false,
          active: false,
          reverse: false,
        },
      ],
    }
  },
  watch: {
    profileCallsDone: {
      immediate: true,
      handler() {
        if (this.profileIncomingConnections !== null
          && this.profileIncomingRatings !== null && !this.setDataCalled) {
          this.setUserData()
        }
      }
    }
  },
  methods: {
    async getUserData() {
    },
    setUserData() {
      this.setDataCalled = true
      const ratedUsers = this.$store.getters['profile/ratedUsers']
      const profileIncomingConnections = this.profileIncomingConnections
      const profileIncomingRatings = this.profileIncomingRatings
      this.startUsers = profileIncomingConnections.reduce((a, c) => {
        const mutualConnectionId = c.id
        const mutualConnectionFromOurConnectionsList = this.connections.find(cn => mutualConnectionId === cn.id)
        if (!mutualConnectionFromOurConnectionsList) return a
        const ratingData = ratedUsers.find(
          user => user.toBrightId === mutualConnectionId
        )
        const incomingRatingDataToConnection = profileIncomingRatings.find(
          en => en.fromBrightId === mutualConnectionId
        )
        return a.concat({
          incomingConnectionLevel: c.level,
          ratingData,
          rating: ratingData ? +ratingData.rating : undefined,
          incomingRatingToConnection: incomingRatingDataToConnection ? +incomingRatingDataToConnection.rating : undefined,
          ...mutualConnectionFromOurConnectionsList,
        })
      }, [])
      this.setInitialFilter()
      this.isLoading = false
    },
  }
}
</script>
