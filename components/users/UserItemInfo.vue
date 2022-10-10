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
    <div class="user-item__tag">
      <div :data-testid="`user-item-${user.id}-name-${index}`" class="user-item__tag__name">{{ user.name }}</div>
      <div v-if="showAuraVerification" :data-testid="`user-item-${user.id}-name-${index}`"
           class="user-item__tag__aura-verification">{{ auraVerification }}
      </div>
    </div>
    <small v-if="user.rating" :data-testid="`user-item-${user.id}-rating`" class="user-item__rate">({{
        user.rating
      }})</small>
  </nuxt-link>
</template>

<script>
import avatar from '~/mixins/avatar'
import {auraBrightIdNodeApi} from "~/scripts/api";

export default {
  name: "UserItemInfo",
  mixins: [avatar],
  props: {
    showAuraVerification: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: () => ({}),
    },
    index: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      auraVerification: 'loading...',
    }
  },
  computed: {
    img() {
      return this.user?.id
    }
  },
  created() {
    if (this.showAuraVerification) {
      auraBrightIdNodeApi.get(`/brightid/v6/users/${this.user.id}/profile`).then(res => {
        const auraVerification = res.data.data.verifications.find(verification => verification.name === 'Aura')
        this.auraVerification = auraVerification?.level || 'Not yet'
      })
    }
  }
}
</script>

<style scoped>

</style>
