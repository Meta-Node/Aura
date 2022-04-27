export default {
  data() {
    return {
      profileAvatar: '/images/avatar-thumb.jpg',
    }
  },

  mounted() {
    setTimeout(() => {
      this.getAvatar()
    }, 100)
  },

  methods: {
    async getAvatar() {
      this.profileAvatar =
        (await this.$store.dispatch('profile/getProfilePhoto', this.img)) ||
        this.profileAvatar
    },
  },
}
