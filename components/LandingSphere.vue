<template>
  <div ref="sphere" class="landing-sphere"></div>
</template>

<script>
import transition from '~/mixins/transition'

export default {
  mixins: [transition],

  async mounted() {
    try {
      const {Sphere} = await import('~/scripts/Sphere')

      this.scene = new Sphere(this.$refs.sphere)
    } catch (error) {
      console.log(error)
    }
  },

  beforeDestroy() {
    try {
      this.scene && this.scene.destroy()
    } catch (error) {
      console.log(error)
    }
  },
}
</script>
