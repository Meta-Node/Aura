<template>
  <div class="app-explorer">
    <div class="app-explorer__statistic">
      <div class="app-explorer__switch-wrapper">
        <app-filter :filters="filters" @filtered="onFiltered" />
      </div>
      <div class="app-explorer__humans-stat">
        <ul v-if="users.length" class="app-explorer__humans">
          <user-v-2
            v-for="user in users"
            :key="user.id"
            :img="user.photo"
            :name="user.nickname || user.name"
            :url="`/profile/${user.id}`"
            inbound="0%"
            :outbound="user.transferedEnergy + '%'"
          />
        </ul>
        <span v-else class="users-not-found">Users not found</span>
      </div>
      <!-- <load-more text="Load More..." /> -->
    </div>
  </div>
</template>

<script>
import AppFilter from '../filters/AppFilter.vue'
import UserV2 from '~/components/users/UserV2.vue'

export default {
  components: { UserV2, AppFilter },
  props: {
    users: {
      type: Array,
      default: () => [],
    },
    filters: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    onFiltered(name) {
      this.$emit('filtered', name)
    },
  },
}
</script>