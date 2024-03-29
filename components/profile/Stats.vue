<template>
  <div>
    <div v-if="!isOwn" class="stats__return" @click="clearStat">
      &lt;- Return to
      Profile
    </div>
    <div
      v-if="loadingProfileData"
      style="margin-top: 40px"
    >
      <app-spinner :is-visible="true"/>
    </div>
    <div
      v-else
      class="mutual-connections__users"
    >
      <h3 class="mutual-connections__title" style="margin-top: 15px;">{{ titles[stat] }}</h3>
      <div class="filter switch-wrapper">
        <app-filter :filters="filters" @clearFilters="clearFilters" @filtered="onFiltered"/>
      </div>
      <lazy-loading-items
        v-if="users.length"
        :items="users"
        @updateItems="onUpdateItems"
      >
        <small class="mutual-connections__inbound-toggle" @click="isInbound = !isInbound">{{
            isInbound ? `Opinion about ${profile.name || 'Unknown'}` : `${profile.name || 'Unknown'}'s opinion`
          }}</small>
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
import {ENERGY_INBOUND_STAT, ENERGY_OUTBOUND_STAT, RATING_INBOUND_STAT, RATING_OUTBOUND_STAT} from "~/utils/constants";


const filterKey = 'statFilters'

export default {
  components: {
    LazyLoadingItems, MutualConnection,
    // CustomSelect,
    AppFilter
  },
  mixins: [transition, users, loadItems],
  props: {
    isOwn: {
      type: Boolean,
    },
    stat: {
      type: String,
    },
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
  },
  data() {
    return {
      isInbound: true,
      filterKey,
      defaultFilter: 'MutualFirst',
      titles: {
        [RATING_INBOUND_STAT]: "Inbound Rating",
        [RATING_OUTBOUND_STAT]: "Outbound Rating",
        [ENERGY_INBOUND_STAT]: "Inbound Energy",
        [ENERGY_OUTBOUND_STAT]: "Outbound Energy",
      },
      isLoading: true,
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
    },
    stat: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.setUserData()
        }
      }
    },
  },
  methods: {
    clearStat() {
      this.$router.replace({query: {...this.$route.query, stat: undefined}})
    },
    async getUserData() {
    },
    setUserData() {
      if (this.loadingProfileData) return
      const ratedUsers = this.$store.getters['profile/ratedUsers']
      this.startUsers = this.profileIncomingConnections.reduce((a, c) => {
        const mutualConnectionId = c.id
        const mutualConnectionFromOurConnectionsList = this.connections.find(cn => mutualConnectionId === cn.id)
        const ratingData = ratedUsers.find(
          user => user.toBrightId === mutualConnectionId
        )
        const incomingRatingDataToConnection = this.profileIncomingRatings.find(
          en => en.fromBrightId === mutualConnectionId
        )
        if (this.stat === RATING_INBOUND_STAT && !incomingRatingDataToConnection) return a
        const outboundRatingDataToConnection = this.profileRatedUsers.find(
          en => en.toBrightId === mutualConnectionId
        )
        if (this.stat === RATING_OUTBOUND_STAT && !outboundRatingDataToConnection) return a
        const inboundEnergyDataToConnection = this.profileInboundEnergy.find(
          en => en.fromBrightId === mutualConnectionId
        )
        if (this.stat === ENERGY_INBOUND_STAT && !inboundEnergyDataToConnection) return a
        const outboundEnergyDataToConnection = this.profileTransferredEnergy.find(
          en => en.toBrightId === mutualConnectionId
        )
        if (this.stat === ENERGY_OUTBOUND_STAT && !outboundEnergyDataToConnection) return a
        return a.concat({
          id: mutualConnectionId,
          incomingConnectionLevel: c.level,
          outboundConnectionLevel: mutualConnectionFromOurConnectionsList.level,
          ratingData,
          rating: ratingData ? +ratingData.rating : undefined,
          incomingRatingToConnection: incomingRatingDataToConnection ? +incomingRatingDataToConnection.rating : undefined,
          outgoingRatingToMutualConnection: outboundRatingDataToConnection ? +outboundRatingDataToConnection.rating : undefined,
          ...(mutualConnectionFromOurConnectionsList || {
            name: mutualConnectionId,
          }),
          unknownConnection: !mutualConnectionFromOurConnectionsList,
        })
      }, [])
      this.setInitialFilter()
      this.isLoading = false
    },
  }
}
</script>
