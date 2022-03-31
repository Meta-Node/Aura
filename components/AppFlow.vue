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
      <text-button text="Load More..." />
      <button class="flow__circle-button">
        <span class="flow__check-mark"
          ><svg
            width="14"
            height="10"
            viewBox="0 0 14 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.66699 5L5.66699 9L12.3337 1"
              stroke="#EEEEEE"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            /></svg
        ></span>
      </button>
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