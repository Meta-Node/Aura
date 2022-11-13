<template>
  <nuxt-link :data-testid="`user-item-${index}`" :to="`/profile/${user.id}`"
  >
    <div class="user-item__container" @click.prevent="navigateToProfile">
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
        <div v-if="showAuraVerification"
             :class="auraVerification ? `aura-verification-color--${auraVerification.toLowerCase()}` : ''"
             class="user-item__tag__aura-verification aura-verification-color">{{ auraVerification || 'loading...' }}
        </div>
      </div>
      <small v-if="user.rating" :data-testid="`user-item-${user.id}-rating`" class="user-item__rate">({{
          user.rating
        }})</small>
    </div>
  </nuxt-link>
</template>

<script>
import avatar from '~/mixins/avatar'
import {getAuraVerificationString} from "~/scripts/api/auranode.service";

export default {
  name: "UserItemInfo",
  mixins: [avatar],
  props: {
    safeNavigateTo: {
      type: Function
    },
    showAuraVerification: {
      type: Boolean,
      default: true,
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
      auraVerification: null,
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
  },
  methods: {
    navigateToProfile() {
      this.safeNavigateTo(`/profile/${this.user.id}`)
    }
  }
}
</script>

<style scoped>

</style>
