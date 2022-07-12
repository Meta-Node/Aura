<template>
  <div class="four-unrated">
    <h3 class="four-unrated__title">Yet To Be Rated</h3>

    <ul v-if="users && users.length" class="user-v1-ul">
      <user-v-1
        v-for="user in users"
        :id="user.id"
        :key="user.id"
        :name="user.nickname || user.name"
        :url="`/profile/${user.id}`"
      />
    </ul>
    <div v-else style="margin-top: 20px; text-align: center">
      You don't have unrated connections
    </div>
  </div>
</template>

<script>
import UserV1 from '~/components/users/UserV1.vue'

export default {
  components: {UserV1},
  props: {
    users: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
