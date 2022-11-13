<template>
  <div class="app-energy">
    <div v-if="debugError" class="debug-error">debug error: {{ debugError }}</div>
    <div class="app-energy__statistic">
      <div class="app-energy__switch-wrapper">
        <app-filter :filters="filters" @clearFilters="clearFilters" @filtered="onFiltered"/>
      </div>
      <div class="app-energy__humans-stat">
        <lazy-loading-items
          v-if="users.length"
          :items="users"
          @updateItems="onUpdateItems"
        >
          <ul class="app-energy__humans">
            <div class="app-energy__labels__container">
              <div class="app-energy__labels__total-amount">Total {{ totalAmount }}</div>
              <div class="app-energy__labels__inbound">Inbound</div>
            </div>
            <user-v-3
              v-for="(user, i) in visibleItems"
              :id="user.id"
              :key="user.id"
              :energy="user.transferedEnergy"
              :img="user.id"
              :index="i"
              :name="user.nickname || user.name"
              :rating="+user.rating"
              :url="`/profile/${user.id}`"
              :user="user"
              @changeEnergy="onChangeEnergy"
            />
          </ul>
        </lazy-loading-items>
        <span v-else
              class="users-not-found">To give your connections energy, first visit <nuxt-link class="app-energy__link"
                                                                                              to="/connections/">the connections page</nuxt-link> and rate them.</span>
      </div>
      <!-- <load-more text="Load More..." /> -->
      <div v-if="unsavedChangedEnergies.length && users.length" class="app-energy__save">
        <button class="app-energy__save__button" data-testid="update-energy" @click="updateEnergy">
          save changes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AppFilter from '../filters/AppFilter.vue'
import UserV3 from '~/components/users/UserV3.vue'
import loadItems from '~/mixins/loadItems'
import energySet from "~/mixins/energySet";

export default {
  components: {UserV3, AppFilter},
  mixins: [loadItems, energySet],
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
  data() {
    return {
      debugError: null
    }
  },
  computed: {
    totalAmount() {
      return this.energyData.map(user => user.amount).reduce(
        (prev, cur) => prev + cur,
        0
      )
    }
  },
  mounted() {
    this.energyData = this.$store.state.energy.transferedEnergy
  },
  methods: {
    clearFilters() {
      this.$emit('clearFilters')
    },
    onFiltered(name) {
      this.$emit('filtered', name)
    },
  },
}
</script>
