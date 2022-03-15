<template>
  <section class="community">
    <div class="container community__wrapper">
      <div class="community__search">
        <h3 class="community__search-title">Find A Connection</h3>
        <app-search @searchValue="onSearchValue" />
      </div>
      <div class="community__users">
        <h3 class="community__humans-title">Your Connections</h3>
        <div class="switch-wrapper">
          <filter-button name="Name" :active="true" />
          <filter-button name="Rating" />
          <filter-button name="Unrated" :is-icon="false" />
        </div>
        <ul v-if="users.length" class="user-v1-ul">
          <user-v-1
            v-for="(user, idx) in users"
            :key="idx"
            :is-brightness="true"
            :brightness="brightness"
            img="/images/card-img.jpg"
            :name="user.name"
            url="/"
          />
        </ul>
        <span v-else class="users-not-found">Users not found</span>
        <div class="btn__wrapper">
          <button class="text-button community__btn">Load More...</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import UserV1 from '~/components/UserV1.vue'
import FilterButton from '~/components/FilterButton.vue'
import AppSearch from '~/components/AppSearch.vue'
import transition from '~/mixins/transition'
import users from '~/mixins/users'
export default {
  components: { UserV1, FilterButton, AppSearch },
  mixins: [transition, users],
  computed: {
    brightness() {
      return Math.round(20 * Math.random())
    },
  },
}
</script>