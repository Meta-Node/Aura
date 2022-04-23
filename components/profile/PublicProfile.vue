<template>
  <section class="profile">
    <div v-if="isLoading" style="margin-top: 40px">
      <app-spinner :is-visible="true" />
    </div>
    <div v-else-if="!isLoading && !profile.name" class="container">
      User not found
    </div>
    <div v-else class="container profile__wrapper">
      <profile-info
        :img="profile.photo"
        :name="profile.name"
        :rating="profile.rating"
        :date="date"
        :connections="profile.numOfConnections"
        :brightness="brightness"
        :is-own-profile="isOwn"
        @share="onShare"
      />
      <aura-sphere class="profile__sphere" :rating="profile.rating" />
      <four-unrated :users="fourUnrated" />
    </div>
  </section>
</template>

<script>
import ProfileInfo from '~/components/ProfileInfo.vue'
import AuraSphere from '~/components/AuraSphere.vue'

import transition from '~/mixins/transition'
import FourUnrated from '~/components/FourUnrated.vue'

export default {
  components: { ProfileInfo, AuraSphere, FourUnrated },
  mixins: [transition],
  props: {
    profile: {
      type: Object,
      default: () => {},
    },
    connections: {
      type: Object,
      default: () => {},
    },
    isLoading: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String,
      default: '',
    },
    isOwn: {
      type: Boolean,
      default: true,
    },
    brightness: {
      type: Number,
      default: 0,
    },
    fourUnrated: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    onShare() {
      this.$emit('share')
    },
  },
}
</script>