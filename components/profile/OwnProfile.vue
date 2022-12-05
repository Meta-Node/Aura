<template>
  <div>
    <four-unrated :users="fourUnrated"/>
  </div>
</template>

<script>
import transition from '~/mixins/transition'
import FourUnrated from '~/components/FourUnrated.vue'

export default {
  components: {
    FourUnrated
  },
  mixins: [transition],
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
    profileIncomingConnections: {
      type: Array,
      default: () => [],
    },
    profileInboundEnergy: {
      type: Array,
      default: () => [],
    },
    profileTransferredEnergy: {
      type: Array,
      default: () => [],
    },
    profileRatedUsers: {
      type: Array,
      default: () => [],
    },
    profileIncomingRatings: {
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
