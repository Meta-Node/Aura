<template>
  <nuxt-link :to="`/profile/${user.id}`" class="user-item__username">
    <nuxt-img
      :alt="user.name"
      :src="profileAvatar"
      class="user-item__image"
      height="48"
      loading="lazy"
      width="48"
    />
    <p :data-testid="`user-item-${user.id}-name-${index}`" class="user-item__tag">{{ user.name }}</p>
    <small v-if="user.rating" :data-testid="`user-item-${user.id}-rating`" class="user-item__rate">({{
        user.rating
      }})</small>
  </nuxt-link>
</template>

<script>
import avatar from '~/mixins/avatar'

export default {
  name: "UserItemInfo",
  mixins: [avatar],
  props: {
    user: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    img() {
      return this.user?.id
    }
  }
}
</script>

<style scoped>

</style>
