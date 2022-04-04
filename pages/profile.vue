<template>
  <section class="profile">
    <div class="container profile__wrapper">
      <profile-info
        :img="profile.photo"
        :name="profile.name"
        rating="Bronze"
        date="4 months"
        :connections="116"
        :brightness="brightness"
        :is-own-profile="true"
      />
      <aura-sphere class="profile__sphere" :rating="75" />
      <div class="profile__users">
        <h3 class="profile__title">Yet To Be Rated</h3>
        <ul class="user-v1-ul">
          <user-v-1
            v-for="(user, idx) in 3"
            :key="idx"
            img="/images/card-img.jpg"
            name="User Name"
            url="/"
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
export default {
  components: { UserV1, ProfileInfo, AuraSphere },
  mixins: [transition],
  data() {
    return {
      profileMock: {
        photo: '/images/card-img.jpg',
        name: 'User Name',
      },
    }
  },
  computed: {
    brightness() {
      return Math.round(10 * Math.random())
    },
    profile() {
      if (Object.keys(this.$store.state?.profile?.profile).length) {
        return this.$store.state.profile.profile
      } else {
        return this.profileMock
      }
    },
  },
}
</script>