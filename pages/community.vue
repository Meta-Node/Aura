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
        <ul v-if="users.length" class="user-v1-ul">
          <user-v-1
            v-for="user in users"
            :key="user.id"
            :is-brightness="true"
            :brightness="user.rating / 10"
            :img="user.id"
            :name="user.nickname || user.name"
            :url="`/profile/${user.id}`"
          />
        </ul>
        <span v-else class="users-not-found">Users not found</span>
        <!-- <load-more text="Load More..." /> -->
      </div>
    </div>
  </section>
</template>

<script>
// Should works with https://www.npmjs.com/package/vue-infinite-scroll
import UserV1 from '~/components/users/UserV1.vue'

import AppSearch from '~/components/AppSearch.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'
import AppFilter from '~/components/filters/AppFilter.vue'
export default {
  components: { UserV1, AppSearch, AppFilter },
  mixins: [transition, users],
  data() {
    return {
      filters: [
        {
          name: 'All',
          isIcon: false,
          active: true,
          reverse: false,
        },
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
      ],
    }
  },
}
</script>