<template>
  <section class="profile">
    <div v-if="isLoadingInitialData" style="margin-top: 40px">
      <app-spinner :is-visible="true"/>
    </div>
    <div v-else-if="!isLoadingInitialData && !profile" class="container">
      User not found
    </div>
    <div v-else class="container profile__wrapper">
      <profile-info
        :id="profile.id"
        :brightness="brightness"
        :connection-date="profile.connectionDate"
        :date="date"
        :img="profileAvatar"
        :is-own-profile="isOwn"
        :name="profile.name || 'Unknown'"
        :num-of-connections="profile.numOfConnections"
        :rating="profile.rating"
        @share="onShare"
      />
      <aura-statistics/>
      <four-unrated :users="fourUnrated"/>
    </div>
  </section>
</template>

<script>
import ProfileInfo from '~/components/ProfileInfo.vue'
import transition from '~/mixins/transition'
import avatar from '~/mixins/avatar'
import FourUnrated from '~/components/FourUnrated.vue'
import AuraStatistics from "~/components/profile/AuraStatistics";

export default {
  components: {
    AuraStatistics,
    ProfileInfo,
    FourUnrated
  },
  mixins: [transition, avatar],
  props: {
    profile: {
      type: Object,
      default: () => {
      },
    },
    connections: {
      type: Object,
      default: () => {
      },
    },
    isLoadingInitialData: {
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

  computed: {
    img() {
      return this.$route.params.id
    },
  },

  methods: {
    onShare() {
      this.$emit('share')
    },
  },
}
</script>
