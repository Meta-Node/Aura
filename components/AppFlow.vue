<template>
  <div class="flow">
    <div class="flow__input-wrapper">
      <app-search @searchValue="onSearchValue" />
    </div>
    <div class="flow__statistic">
      <div class="flow__stat-filter">
        <button class="flow__stat-button flow__stat-button--active">
          Inbound
        </button>
        <button class="flow__stat-button">Outbound</button>
      </div>
      <div class="flow__switch-wrapper">
        <filter-button name="Name" :active="true" />
        <filter-button name="Amount" />
      </div>
      <div class="flow__humans-stat">
        <ul v-if="users.length" class="flow__humans">
          <user-v-2
            v-for="(user, idx) in users"
            :key="idx"
            img="/images/card-img.jpg"
            :name="user.name"
            url="/"
            inbound="190.7%"
            outbound="148.6%"
          />
        </ul>
        <span v-else class="users-not-found">Users not found</span>
      </div>
      <div class="btn__wrapper">
        <button class="text-button flow__btn">Load More...</button>
      </div>
    </div>
  </div>
</template>

<script>
import AppSearch from './AppSearch.vue'
import UserV2 from '~/components/UserV2.vue'
import FilterButton from '~/components/FilterButton.vue'
import users from '~/mixins/users'

export default {
  components: { UserV2, FilterButton, AppSearch },
  mixins: [users],
}
</script>