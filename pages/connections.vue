<template>
  <section class="community">
    <div class="container community__wrapper">
      <div class="community__search">
        <h3 class="community__search-title">Find A Connection</h3>
        <app-search ref="search" @searchValue="onSearchValue"/>
      </div>
      <div v-if="isLoading" style="margin-top: 40px">
        <app-spinner :is-visible="true"/>
      </div>
      <div v-else class="community__users">
        <h3 class="community__humans-title">Your Connections</h3>
        <div class="filter switch-wrapper">
          <app-filter :filters="filters" @filtered="onFiltered"/>
          <!--          <custom-select-->
          <!--            v-model="connectionTypeFilter"-->
          <!--            :options="['All', 'Just met', 'Aready known+']"-->
          <!--            default="All"-->
          <!--            name="Connection Type"-->
          <!--          ></custom-select>-->
        </div>
        <lazy-loading-items
          v-if="users.length"
          :items="users"
          @updateItems="onUpdateItems"
        >
          <ul class="user-item__list">
            <li
              v-for="(user, index) in visibleItems"
              :key="user.id"
              class="user-item__container"
            >
              <user-item-info :index="index" :user="user"></user-item-info>
            </li>
          </ul>
        </lazy-loading-items>
        <span v-else class="users-not-found">Users not found</span>
      </div>
    </div>
  </section>
</template>

<script>
import transition from '~/mixins/transition'
import users from '~/mixins/users'
import loadItems from '~/mixins/loadItems'
import AppSearch from '~/components/AppSearch.vue'

import LazyLoadingItems from '~/components/LazyLoadingItems.vue'
import UserItemInfo from '~/components/users/UserItemInfo'
import AppFilter from "~/components/filters/AppFilter";

const filterKey = 'connectionsPageFilters'

export default {
  components: {
    AppSearch,
    LazyLoadingItems,
    UserItemInfo,
    AppFilter,
  },
  mixins: [transition, users, loadItems],
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
          name: 'RecentConnection',
          label: 'Recent',
          type: 'ordering',
          defaultAscending: false,
          active: false,
          reverse: false,
        },
        {
          name: 'Unrated',
          type: 'filter',
          active: false,
        },
        {
          label: "Connection Type",
          type: "select",
          options: [
            {
              name: 'All',
              type: 'filter',
            },
            {
              name: 'Just Met',
              label: 'Just met',
              type: 'filter',
            },
            {
              name: 'AlreadyKnownPlus',
              label: "Already known+",
              type: 'filter',
            }
          ]
        }
      ]
      // TODO: enable this
      // connectionTypeFilterData:
      //   (process.client && localStorage.getItem('connectionTypeFilter')) ||
      //   'All',
    }
  },
  head() {
    return {
      title: `Aura | Connections`,
    }
  },

  // mounted() {
  //   this.onFiltered('ConnectionType', this.connectionTypeFilter)
  // },

}
</script>
