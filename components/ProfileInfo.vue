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
              height="18"
              viewBox="0 0 20 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 4H3C1.89543 4 1 4.89543 1 6V15C1 16.1046 1.89543 17 3 17H17C18.1046 17 19 16.1046 19 15V6C19 4.89543 18.1046 4 17 4H14M13 8L10 11M10 11L7 8M10 11L10 1"
                stroke="#343434"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
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