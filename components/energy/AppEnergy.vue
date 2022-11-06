<template>
  <div class="app-energy">
    <div v-if="debugError" class="debug-error">debug error: {{ debugError }}</div>
    <div class="app-energy__statistic">
      <div class="app-energy__switch-wrapper">
        <app-filter :filters="filters" @filtered="onFiltered"/>
      </div>
      <div class="app-energy__humans-stat">
        <lazy-loading-items
          v-if="users.length"
          :items="users"
          @updateItems="onUpdateItems"
        >
          <ul class="app-energy__humans">
            <div class="app-energy__total-amount__container">
              <p class="app-energy__total-amount__text">Total {{ totalAmount }}</p>
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
      <div v-if="changedEnergies.length && users.length" class="app-energy__save">
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
import {IS_PRODUCTION, TOAST_ERROR, TOAST_SUCCESS} from "~/utils/constants";

export default {
  components: {UserV3, AppFilter},
  mixins: [loadItems],
  props: {
    changedEnergies: {
      type: Array,
      default: () => []
    },
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
      energyData: [],
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
    async updateEnergy() {
      try {
        this.$store.commit('app/setLoading', true)
        await this.$store.dispatch('energy/updateEnergy')
        this.$store.commit('app/setLoading', false)
        this.$store.commit('toast/addToast', {
          text: 'Energy successfully updated',
          color: TOAST_SUCCESS,
        })
        // this.$router.push('/connections?filter=Unrated')
        this.$emit('getTransferedEnergy')
      } catch (error) {
        this.$store.commit('app/setLoading', false)
        if (!IS_PRODUCTION) {
          this.debugError = JSON.stringify(error.response?.data)
        }
        if (error.message === 'retryRequest') {
          this.updateEnergy()
        } else {
          this.$store.commit('toast/addToast', {text: 'Error', color: TOAST_ERROR})
        }
      }
    },
    onChangeEnergy(data) {
      const updatedEnergy = this.energyData.filter(
        en => en.toBrightId !== data.toBrightId
      )
      updatedEnergy.push(data)
      this.energyData = updatedEnergy
      this.$store.commit('energy/setTransferedEnergy', this.energyData)
      // console.log(this.energyData)
    },
    onFiltered(name) {
      this.$emit('filtered', name)
    },
  },
}
</script>
