<template>
  <section class="profile">
    <div class="container profile__wrapper">
      <profile-info
        img="/images/card-img.jpg"
        name="User Name"
        rating="Low"
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
        <div class="btn__wrapper">
          <button class="text-button profile__btn">Load More...</button>
        </div>
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

  computed: {
    brightness() {
      return Math.round(10 * Math.random())
    },
  },
}
</script>