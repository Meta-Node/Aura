import { toRoundedPercentage } from '~/utils/numbers'

export default {
  computed: {
    energySum() {
      return this.$store.getters['energy/transferedEnergyAmount']
    },
    outboundPercentage() {
      return toRoundedPercentage(this.outbound, this.energySum)
    },
  },

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
