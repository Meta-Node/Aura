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
import {getAuraVerificationString} from "~/scripts/api/auranode.service";

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
      getAuraVerificationString(this.user.id).then(auraVerification => {
        this.auraVerification = auraVerification
      })
    }
  }
}
</script>

<style scoped>

</style>
