<template>
  <div
    class="aura-sphere"
    :style="`--diameter: ${diameter}px; --lightness: ${lightness}px;`"
  ></div>
</template>

<script>
import { getRange } from '~/scripts/utils/getRange'
export default {
  props: {
    rating: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    diameter() {
      const STEPS_COUNT = 100
      const MAX_DIAMETER = 192
      const MIN_DIAMETER = 48

      const PERCENT_STEPS = getRange(0, 100, STEPS_COUNT)
      const STEPS = getRange(MIN_DIAMETER, MAX_DIAMETER, STEPS_COUNT)

      let diameter = 0

      PERCENT_STEPS.forEach((val, idx) => {
        if (Math.round(val) === this.rating) {
          diameter = STEPS[idx]
        }
      })

      return diameter
    },
    lightness() {
      return this.diameter / 2
    },
  },
}
</script>