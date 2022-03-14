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
      const STEPS_COUNT = 9
      const MAX_DIAMETER = 192
      const MIN_DIAMETER = 48

      const PERCENT_STEPS = getRange(100, -100, STEPS_COUNT)
      const STEPS = getRange(MAX_DIAMETER, MIN_DIAMETER, STEPS_COUNT)

      let currentValue = 0

      PERCENT_STEPS.forEach((val, idx) => {
        if (val === this.rating) {
          currentValue = STEPS[idx]
        }
      })

      const diameter = currentValue

      return diameter
    },
    lightness() {
      return this.diameter / 2
    },
  },
}
</script>