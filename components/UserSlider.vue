<template>
  <div class="user">
    <div class="user__slider">
      <div
        class="user__slider__action"
        @click="decrease">-
      </div>
      <input
        v-model="percents"
        :data-testid="`user-slider-${userId}-input`"
        :max="values[values.length - 1]"
        :min="values[0]"
        class="user__slider__input" type="number"/>
      <div
        class="user__slider__action"
        @click="increase">+
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userId: {
      type: String,
    },
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    step: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    quota: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      percents: 0,
      values: [0, 1, 2, 5, 25, 100]
    }
  },

  computed: {
    availableEnergy() {
      return this.$store.state.energy.availableEnergy
    },
  },

  watch: {
    percents(_current, _prev) {
      // if (current > this.quota) {
      //   this.percents = this.quota
      // }
      //
      // this.$nextTick(() => {
      //   if (this.availableEnergy < 0) {
      //     if (current > prev) {
      //       this.percents = +prev
      //       this.$emit('changeEnergy', +this.percents)
      //       this.$forceUpdate()
      //     }
      //   }
      // })
      this.$emit('changeEnergy', +this.percents)
    },
  },

  mounted() {
    this.percents = this.value
  },

  methods: {
    increase() {
      for (let i = 0; i < this.values.length; i++) {
        if (this.values[i] > this.percents) {
          this.percents = this.values[i]
          return
        }
      }
    },
    decrease() {
      for (let i = this.values.length - 1; i >= 0; i--) {
        if (this.values[i] < this.percents) {
          this.percents = this.values[i]
          return
        }
      }
    },
  },
}
</script>
