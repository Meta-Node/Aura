<template>
  <section class="profile">
    <div class="container profile__wrapper">
      <profile-info
        :img="profile.photo"
        :name="profile.name"
        rating="Bronze"
        :date="difDate.value"
        :connections="profile.numOfConnections"
        :brightness="brightness"
        :is-own-profile="true"
      />
      <aura-sphere class="profile__sphere" :rating="75" />
      <div class="profile__users">
        <h3 class="profile__title">Yet To Be Rated</h3>
        <ul class="user-v1-ul">
          <user-v-1
            v-for="user in connections"
            :key="user.id"
            :img="user.photo"
            :name="user.name"
            :url="`/profile/${user.id}`"
          />
        </ul>
        <load-more text="Load More..." />
      </div>
    </div>
  </section>
</template>

<script>
import ProfileInfo from '~/components/ProfileInfo.vue'
import AuraSphere from '~/components/AuraSphere.vue'
import UserV1 from '~/components/UserV1.vue'
import transition from '~/mixins/transition'
import { getProfile } from '~/scripts/api/connections.service'

export default {
  components: { UserV1, ProfileInfo, AuraSphere },
  mixins: [transition],
  data() {
    return {
      profile: {},
      connections: [],
      difDate: {},
    }
  },
  computed: {
    brightness() {
      return Math.round(10 * Math.random())
    },
  },
  async mounted() {
    const profileData = JSON.parse(localStorage.getItem('profileData') || '[]')
    this.profile = profileData.profile

    this.connections = profileData.connections

    const res = await getProfile(profileData.profile.id)
    this.profile = { ...this.profile, ...res.data }

    this.getDate()
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
  },
}
</script>