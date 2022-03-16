<template>
  <div class="grid profile-info">
    <profile-avatar :img="img" alt="Avatar" :brightness="brightness" />
    <div class="profile__user-info">
      <div class="profile__username">
        <div class="profile__block-left">
          <h3 class="profile__name" :title="name" v-html="separatedName" />
        </div>
        <div class="profile__block-right">
          <p
            class="profile__rating"
            :class="`profile__rating--${rating.toLowerCase()}`"
          >
            {{ rating }}
          </p>
          <nuxt-link to="/">
            <svg
              class="profile__share"
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.944 6.112C16.507 2.67 13.56 0 10 0C7.244 0 4.85 1.61 3.757 4.149C1.609 4.792 0 6.82 0 9C0 11.657 2.089 13.815 4.708 13.971V14H15.99V13.997L16 14C18.206 14 20 12.206 20 10C19.9988 9.10352 19.6971 8.23332 19.1431 7.5285C18.5891 6.82368 17.8148 6.32494 16.944 6.112V6.112ZM6 7H9V4H11V7H14L10 12L6 7Z"
                fill="#EEEEEE"
              />
            </svg>
          </nuxt-link>
        </div>
      </div>
      <div class="profile__about">
        <p class="profile__info">
          {{ date }}<br />
          {{ connections }} Connections
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileAvatar from './ProfileAvatar.vue'
export default {
  components: { ProfileAvatar },
  props: {
    img: {
      type: String,
      default: '/',
    },
    name: {
      type: String,
      default: 'Name',
    },
    rating: {
      type: String,
      default: 'Low',
    },
    date: {
      type: String,
      default: '',
    },
    connections: {
      type: Number,
      default: 0,
    },
    brightness: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    separatedName() {
      return this.name.replace(' ', '<br />')
    },
  },
}
</script>