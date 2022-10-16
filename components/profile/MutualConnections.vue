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
        <app-filter :filters="filters" @filtered="onFiltered"/>
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
import {getIncomingConnections} from "~/scripts/api/connections.service";
import {getIncomingRatings} from "~/scripts/api/rate.service";


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
      default: () => {
      },
    },
  },
  data() {
    return {
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

  methods: {
    async getUserData() {
      try {
        this.isLoading = true
        await this.loadUserProfile()

        const ratedUsers = this.$store.getters['profile/ratedUsers']
        const myConnectionConnections = (await getIncomingConnections(this.profile.id)).data?.data.connections
        const myConnectionIncomingRatings = (await getIncomingRatings(this.profile.id))
        const finalUsers = myConnectionConnections.reduce((a, c) => {
          const connectionId = c.id
          const conn = this.connections.find(cn => connectionId === cn.id)
          if (!conn) return a
          const ratingData = ratedUsers.find(
            user => user.toBrightId === connectionId
          )
          const incomingRatingDataToConnection = myConnectionIncomingRatings.find(
            en => en.fromBrightId === connectionId
          )
          return a.concat({
            incomingConnectionLevel: c.level,
            ratingData,
            rating: ratingData ? +ratingData.rating : undefined,
            incomingRatingToConnection: incomingRatingDataToConnection ? +incomingRatingDataToConnection.rating : '-',
            ...conn,
          })
        }, [])

        this.startUsers = finalUsers

        this.users = this.startUsers

        const activeFilter = this.filters?.find(
          filter => filter.type !== 'ordering' && filter.active
        )
        if (activeFilter) {
          this.onFiltered()
        } else {
          this.onFiltered(this.$route.query?.filter || 'All')
        }
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    },

  }

}
</script>
