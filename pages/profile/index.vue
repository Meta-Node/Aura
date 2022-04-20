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
        :date="difDate.value"
        :connections="profile.numOfConnections"
        :brightness="brightness"
        :is-own-profile="true"
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
  data() {
    return {
      profile: {},
      connections: [],
      difDate: {},
      isLoading: true,
    }
  },
  computed: {
    brightness() {
      return this.profile?.rating / 10
    },
    fourUnrated() {
      return this.$store.getters['profile/fourUnrated']
    },
  },
  async mounted() {
    try {
      this.isLoading = true
      await this.$store.dispatch('profile/getProfileData')

      this.profile = this.$store.getters['profile/profileData']
      this.connections = this.$store.getters['profile/connections']

      this.getDate()
    } catch (error) {
      console.log(error)
      this.$store.commit('toast/addToast', { text: 'Error', color: 'danger' })
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    getDate() {
      const today = new Date()
      const reg = new Date(this.profile.brightIdDate)

      const todayDate = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      }

      const regDate = {
        year: reg.getFullYear(),
        month: reg.getMonth() + 1,
        day: reg.getDate(),
      }

      Object.keys(todayDate).forEach(key => {
        this.difDate[key] = todayDate[key] - regDate[key]
      })

      if (this.difDate.year >= 1) {
        this.difDate.value = this.difDate.year + ' year(s)'
        return
      }

      if (this.difDate.year < 1 && this.difDate.month >= 1) {
        this.difDate.value = this.difDate.month + ' month(s)'
        return
      }

      this.difDate.value = '< 1 month'
    },
    async onShare() {
      const { copyToClipboard } = await import(
        '~/scripts/utils/copyToClipboard'
      )
      copyToClipboard(location.href + '/' + this.profile.id)
      this.$store.commit('toast/addToast', {
        text: 'Link was coppied to your clipboard',
        color: 'primary',
      })
    },
  },
}
</script>