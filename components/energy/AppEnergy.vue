<template>
  <div class="app-energy">
    <div class="app-energy__statistic">
      <div class="app-energy__switch-wrapper">
        <app-filter :filters="filters" @filtered="onFiltered" />
      </div>
      <div class="app-energy__humans-stat">
        <ul v-if="users.length" class="app-energy__humans">
          <user-v-3
            v-for="user in users"
            :id="user.id"
            :key="user.id"
            :img="user.photo"
            :name="user.nickname || user.name"
            :rating="+user.rating"
            :energy="user.transferedEnergy"
            :url="`/profile/${user.id}`"
            @changeEnergy="onChangeEnergy"
          />
        </ul>
        <span v-else class="users-not-found">Users not found</span>
      </div>
      <!-- <load-more text="Load More..." /> -->
      <div class="app-energy__circle-wrapper">
        <button class="app-energy__circle-button" @click="updateEnergy">
          <span class="app-energy__check-mark"
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
import AppFilter from '../filters/AppFilter.vue'
import UserV3 from '~/components/users/UserV3.vue'

export default {
  components: { UserV3, AppFilter },
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
      energyData: [],
    }
  },
  mounted() {
    this.energyData = this.$store.state.energy.transferedEnergy
  },
  methods: {
    async updateEnergy() {
      try {
        await this.$store.dispatch('energy/updateEnergy')
        this.$store.commit('toast/addToast', {
          text: 'Energy successfully updated',
          color: 'success',
        })
        this.$router.push('/community?filter=Unrated')
      } catch (error) {
        this.$store.commit('toast/addToast', { text: 'Error', color: 'danger' })
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