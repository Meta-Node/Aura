<template>
  <div class="app-explorer">
    <div class="app-explorer__statistic">
      <div class="app-explorer__switch-wrapper">
        <app-filter :filters="filters" @filtered="onFiltered" />
      </div>
      <div class="app-explorer__humans-stat">
        <lazy-loading-items
          v-if="users.length"
          :items="users"
          @updateItems="onUpdateItems"
        >
          <small class="app-explorer__table-name">Inbound / Outbound</small>
          <ul class="app-explorer__humans">
            <user-v-2
              v-for="user in visibleItems"
              :key="user.id"
              :img="user.id"
              :name="user.nickname || user.name"
              :rating="+user.rating"
              :url="`/profile/${user.id}`"
              :inbound="user.inboundEnergy + '%'"
              :outbound="user.transferedEnergy + '%'"
            />
          </ul>
        </lazy-loading-items>
        <span v-else class="users-not-found">Users not found</span>
      </div>
    </div>
  </div>
</template>

<script>
import AppFilter from '../filters/AppFilter.vue'
import UserV2 from '~/components/users/UserV2.vue'
import loadItems from '~/mixins/loadItems'

export default {
  components: { UserV2, AppFilter },
  mixins: [loadItems],
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