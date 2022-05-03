<template>
  <section class="community">
    <div class="container community__wrapper">
      <div class="community__search">
        <h3 class="community__search-title">Find A Connection</h3>
        <app-search @searchValue="onSearchValue" />
      </div>
      <div v-if="isLoading" style="margin-top: 40px">
        <app-spinner :is-visible="true" />
      </div>
      <div v-else class="community__users">
        <h3 class="community__humans-title">Your Connections</h3>

        <app-filter :filters="filters" @filtered="onFiltered" />
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
import AppFilter from '~/components/filters/AppFilter.vue'

import LazyLoadingItems from '~/components/LazyLoadingItems.vue'
import UserV1 from '~/components/users/UserV1.vue'
export default {
  components: { AppSearch, AppFilter, LazyLoadingItems, UserV1 },
  mixins: [transition, users, loadItems],
  data() {
    return {
      filters: [
        {
          name: 'Name',
          isIcon: true,
          active: false,
          reverse: false,
        },
        {
          name: 'Rating',
          isIcon: true,
          active: false,
          reverse: false,
        },
        {
          name: 'Unrated',
          isIcon: false,
          active: false,
          reverse: false,
        },
        {
          name: 'Already Known',
          isIcon: false,
          active: false,
          reverse: false,
        },
      ],
    }
  },

  head() {
    return {
      title: `Aura | Community`,
    }
  },
}
</script>