<template>
  <div ref="sphere" class="landing-sphere"></div>
</template>

<script>
import transition from '~/mixins/transition'
export default {
  mixins: [transition],

  async mounted() {
    const { Sphere } = await import('~/scripts/Sphere')

    this.scene = new Sphere(this.$refs.sphere)
  },

  beforeDestroy() {
    this.scene && this.scene.destroy()
  },
}
</script>