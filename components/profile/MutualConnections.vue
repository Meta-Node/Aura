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
        <small class="mutual-connections__inbound-toggle"
               @click="isInboundToggle()"
        >{{ isInbound ? `Opinion about ${profile.name || 'Unknown'}` : `${profile.name || 'Unknown'}'s opinion` }}:
        </small>

        <ul class="user-item__list" style="margin-top: 0px">
          <li v-for="(user, index) in visibleItems"
              :key="user.id"
              class="user-item__container"
          >
            <mutual-connection :index="index" :is-inbound="isInbound" :user="user"></mutual-connection>
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
import {badConnectionLevels, goodConnectionLevels} from "~/utils/rating";


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
    profileOutboundConnections: {
      type: Array,
    }
  },

  data() {
    return {
      isInbound: true,
      isLoading: true,
      filterKey,
      defaultFilter: 'AllMutual',
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
    loadingProfileData: {
      immediate: true,
      handler(newValue) {
        if (!newValue) {
          this.setUserData()
        }
      }
    }
  },
  methods: {
    isInboundToggle() {
      this.isInbound = !this.isInbound
    },
    async getUserData() {
    },
    setUserData() {
      const ratedUsers = this.$store.getters['profile/ratedUsers']
      const profileIncomingConnections = this.profileIncomingConnections
      const profileIncomingRatings = this.profileIncomingRatings
      const profileOutboundRatings = this.profileRatedUsers
      const profileOutboundConnections = this.profileOutboundConnections
      const profileRating = +this.profile.previousRating || 0
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
        const outgoingRatingToMutualConnection = profileOutboundRatings.find(
          en => en.toBrightId === mutualConnectionId
        )
        const rating = ratingData ? +ratingData.rating : undefined
        const incomingRatingToConnection = incomingRatingDataToConnection ? +incomingRatingDataToConnection.rating : undefined
        const conflictInRating = profileRating * incomingRatingToConnection < 0

        const incomingConnectionLevel = c.level
        const connectionLevelConflict =
          (badConnectionLevels.includes(mutualConnectionFromOurConnectionsList.level) && goodConnectionLevels.includes(incomingConnectionLevel))
          || (badConnectionLevels.includes(incomingConnectionLevel) && goodConnectionLevels.includes(mutualConnectionFromOurConnectionsList.level))

        const alertDifference = (rating > 0 && (connectionLevelConflict || conflictInRating))

        return a.concat({
          incomingConnectionLevel,
          outboundConnectionLevel: profileOutboundConnections.find(cn => mutualConnectionId === cn.id)?.level || '-',
          ratingData,
          rating,
          incomingRatingToConnection,
          outgoingRatingToMutualConnection: outgoingRatingToMutualConnection ? +outgoingRatingToMutualConnection.rating : undefined,
          ...mutualConnectionFromOurConnectionsList,
          alertDifference
        })
      }, [])
      this.setInitialFilter()
      this.isLoading = false
    },
  }
}
</script>

