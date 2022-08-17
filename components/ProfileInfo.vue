<template>
  <div class="grid profile-info">
    <div class="profile__user-info-left">
      <profile-avatar :brightness="brightness" :img="img" alt="Avatar"/>
      <p v-if="!isOwnProfile" class="profile__user-info-left__last-connection">
        last connection<br/><strong>{{ lastConnection }}</strong>
      </p>
    </div>
    <div class="profile__user-info">
      <div class="profile__username">
        <div class="profile__block-left" data-testid="profile-user-name">
          <h3
            :title="nickname || name"
            class="profile__nickname"
            v-html="separatedName"
          />
          <small
            v-if="nickname"
            class="profile__name"
          >({{ name }})</small>
        </div>
        <div class="profile__block-right">
          <p
            :class="`profile__rating--${ratingText.toLowerCase()}`"
            class="profile__rating"
          >
            {{ ratingText }}
          </p>
          <div class="profile__functions">
            <button
              v-if="!isOwnProfile"
              aria-label="Edit Profile"
              class="profile__edit"
              @click="onEditClick"
            >
              <svg
                fill="none"
                height="17"
                viewBox="0 0 17 17"
                width="17"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.0922 0.69745C12.3029 0.479251 12.555 0.305208 12.8337 0.185476C13.1125 0.0657445 13.4122 0.00272222 13.7156 8.62575e-05C14.0189 -0.00254971 14.3198 0.0552536 14.6005 0.170123C14.8813 0.284993 15.1364 0.454629 15.3509 0.669132C15.5654 0.883636 15.735 1.13871 15.8499 1.41948C15.9647 1.70024 16.0226 2.00107 16.0199 2.30441C16.0173 2.60776 15.9543 2.90754 15.8345 3.18626C15.7148 3.46499 15.5407 3.71708 15.3225 3.92782L14.4167 4.83365L11.1864 1.60328L12.0922 0.69745ZM9.57117 3.21846L0 12.7896V16.02H3.23037L12.8027 6.44883L9.57003 3.21846H9.57117Z"
                  fill="#EEEEEE"
                />
              </svg>
            </button>
            <button
              aria-label="Share Profile"
              class="profile__share"
              @click="onShareClick"
            >
              <svg
                fill="none"
                height="20"
                viewBox="0 0 16 20"
                width="16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.6395 4.7093L7.55813 1.62791L4.47673 4.7093L3.66278 3.89535L7.55813 0L11.4535 3.89535L10.6395 4.7093Z"
                  fill="#EEEEEE"
                />
                <path
                  d="M6.97675 0.813965H8.13954V13.0233H6.97675V0.813965Z"
                  fill="#EEEEEE"
                />
                <path
                  d="M13.3721 20H1.74418C0.755813 20 0 19.2442 0 18.2558V7.79069C0 6.80232 0.755813 6.04651 1.74418 6.04651H5.81395V7.2093H1.74418C1.39535 7.2093 1.16279 7.44186 1.16279 7.79069V18.2558C1.16279 18.6046 1.39535 18.8372 1.74418 18.8372H13.3721C13.7209 18.8372 13.9535 18.6046 13.9535 18.2558V7.79069C13.9535 7.44186 13.7209 7.2093 13.3721 7.2093H9.30232V6.04651H13.3721C14.3605 6.04651 15.1163 6.80232 15.1163 7.79069V18.2558C15.1163 19.2442 14.3605 20 13.3721 20Z"
                  fill="#EEEEEE"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="profile__about">
        <p class="profile__info" data-testid="profile-user-info">
          {{ date }}<br/>
          {{ connections }} Connections
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import {formatDistance} from 'date-fns'
import ProfileAvatar from './ProfileAvatar.vue'

export default {
  components: {ProfileAvatar},
  props: {
    img: {
      type: String,
      default: '/',
    },
    name: {
      type: String,
      default: 'Name',
    },
    nickname: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 0,
    },
    prevRating: {
      type: Number,
      default: 0,
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
    isOwnProfile: {
      type: Boolean,
      default: false,
    },
    connectionDate: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    separatedName() {
      const name = this.nickname ? this.nickname : this.name
      return name.replace(' ', '<br />')
    },
    ratingText() {

      if (this.rating === 0) {
        return 'Unrated'
      }

      if (this.rating <= 33) {
        return 'Bronze'
      }

      if (this.rating <= 66 && this.rating > 33) {
        return 'Silver'
      }

      return 'Gold'
    },
    lastConnection() {
      return formatDistance(new Date(this.connectionDate), new Date(), {addSuffix: true})
    },
  },
  methods: {
    onShareClick() {
      this.$emit('share')
    },
    onEditClick() {
      this.$emit('edit')
    },
  },
}
</script>
