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
        <div class="switch-wrapper">
          <filter-button name="Name" :active="true" />
          <filter-button name="Rating" />
          <filter-button name="Unrated" :is-icon="false" />
        </div>
        <ul v-if="users.length" class="user-v1-ul">
          <user-v-1
            v-for="user in users"
            :key="user.id"
            :is-brightness="true"
            :brightness="user.rating / 10"
            :img="user.photo"
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
import UserV1 from '~/components/users/UserV1.vue'
import FilterButton from '~/components/FilterButton.vue'
import AppSearch from '~/components/AppSearch.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'
export default {
  components: { UserV1, FilterButton, AppSearch },
  mixins: [transition, users],
}
</script>