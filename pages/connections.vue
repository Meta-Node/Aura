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
        <h3 class="community__humans-title">
          <span class="community__humans-title__text">Your Connections</span>
          <svg
            id="Layer_1"
            class="community__humans-title__refresh"
            viewBox="0 0 512 512"
            x="0px"
            xml:space="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            y="0px"
            @click="refreshConnections"
          >
        <path
          d="M69.816,256H0l93.096,93.096L186.2,256h-69.816c0.224-77.016,62.6-139.4,139.616-139.632
	c22.672,0.432,44.952,6,65.16,16.296l34.896-34.896C325.6,80.144,291.176,70.528,256,69.832
	C153.296,70.112,70.104,153.296,69.816,256z M395.616,256c-0.224,77.016-62.6,139.4-139.616,139.632
	c-22.672-0.432-44.952-6-65.16-16.296l-34.896,34.896c30.456,17.624,64.88,27.24,100.056,27.936
	C358.696,441.872,441.88,358.696,442.184,256H512l-93.096-93.096L325.8,256H395.616z"
          style="fill: white"
        />
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
            <g></g>
      </svg>
        </h3>
        <div class="filter switch-wrapper">
          <app-filter :filters="filters" @clearFilters="clearFilters" @filtered="onFiltered"/>
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
      fromRoute: null,
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
          name: 'Rating',
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
              name: 'AllConnections',
              label: 'All',
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
    }
  },
  head() {
    return {
      title: `Aura | Connections`,
    }
  },
}
</script>
