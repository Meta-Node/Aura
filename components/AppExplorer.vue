<template>
  <div class="explorer">
    <div class="explorer__input-wrapper">
      <app-search @searchValue="onSearchValue" />
    </div>
    <div class="explorer__indicator">
      <h3 class="explorer__indicator-text">Your energy</h3>
      <div class="explorer__indicator-wrapper">
        <div class="explorer__indicator-line"></div>
      </div>
      <div class="explorer__indicator-percents">60%</div>
    </div>
    <div class="explorer__statistic">
      <div class="explorer__stat-filter">
        <button class="explorer__stat-button explorer__stat-button--active">
          Explorer
        </button>
        <button class="explorer__stat-button">Energy</button>
      </div>
      <div class="explorer__switch-wrapper">
        <filter-button name="Name" :active="true" />
        <filter-button name="Amount" />
      </div>
      <div class="explorer__humans-stat">
        <ul v-if="users.length" class="explorer__humans">
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
      <div class="explorer__circle-wrapper">
        <button class="explorer__circle-button">
          <span class="explorer__check-mark"
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