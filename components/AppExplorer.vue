<template>
  <div class="explorer">
    <div class="explorer__statistic">
      <div class="explorer__switch-wrapper">
        <filter-button name="Name" :active="true" />
        <filter-button name="Amount" />
      </div>
      <div class="explorer__humans-stat">
        <ul v-if="users.length" class="explorer__humans">
          <user-v-2
            v-for="user in users"
            :key="user.id"
            :img="user.photo"
            :name="user.name"
            :url="`/profile/${user.id}`"
            inbound="190.7%"
            outbound="148.6%"
          />
        </ul>
        <span v-else class="users-not-found">Users not found</span>
      </div>
      <load-more text="Load More..." />
    </div>
  </div>
</template>

<script>
import UserV2 from '~/components/UserV2.vue'
import FilterButton from '~/components/FilterButton.vue'

export default {
  components: { UserV2, FilterButton },
  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
}
</script>