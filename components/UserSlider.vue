<template>
  <div class="user">
    <div class="user__slider">
      <div v-for="val in values" :key="val"
           :class="{user__slider__values__active: percents === val}"
           class="user__slider__values"
           @click="percents = val"
      >{{ val }}
      </div>
    </div>
    <small id="percents" class="user__percents">{{ percents }}</small>
  </div>
</template>

<script>
export default {
  props: {
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
    onAfterChange() {
    },
  },
}
</script>
