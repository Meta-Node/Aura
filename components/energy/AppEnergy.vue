<template>
  <div class="app-energy">
    <div class="app-energy__statistic">
      <div class="app-energy__switch-wrapper">
        <filter-button name="Name" :active="true" />
        <filter-button name="Amount" />
      </div>
      <div class="app-energy__humans-stat">
        <ul v-if="users.length" class="app-energy__humans">
          <user-v-3
            v-for="user in users"
            :id="user.id"
            :key="user.id"
            :img="user.photo"
            :name="user.name"
            :rating="user.rating"
            :url="`/profile/${user.id}`"
            @changeEnergy="onChangeEnergy"
          />
        </ul>
        <span v-else class="users-not-found">Users not found</span>
      </div>
      <load-more text="Load More..." />
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
import UserV3 from '~/components/users/UserV3.vue'
import FilterButton from '~/components/FilterButton.vue'
import { transferEnergy } from '~/scripts/api/energy.service'

export default {
  components: { UserV3, FilterButton },
  props: {
    users: {
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
    this.energyData = this.users.map(user => ({ amount: 0, brightId: user.id }))
  },
  methods: {
    async updateEnergy() {
      const res = await transferEnergy(this.energyData)
      console.log(res)
    },
    onChangeEnergy(data) {
      const updatedEnergy = this.energyData.filter(
        en => en.brightId !== data.brightId
      )
      updatedEnergy.push(data)
      this.energyData = updatedEnergy
    },
  },
}
</script>