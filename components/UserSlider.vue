<template>
  <div class="user">
    <div class="user__slider">
      <label :for="id" class="user__input-label" :style="`--quota: ${quota}%`">
        <input
          :id="id"
          v-model="percents"
          class="user__input-slider"
          :type="type"
          :min="min"
          :max="max"
          :step="step"
        />
      </label>
    </div>
    <small id="percents" class="user__percents">{{ percents }}%</small>
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
    }
  },
  computed: {
    availableEnergy() {
      return this.$store.state.energy.availableEnergy
    },
  },

  watch: {
    percents(current, prev) {
      if (current > this.quota) {
        this.percents = this.quota
      }

      if (this.availableEnergy <= 0) {
        if (current > prev) {
          this.percents = prev
        }
      }

      this.$emit('changeEnergy', +this.percents)
    },
  },

  mounted() {
    this.percents = this.value
  },

  methods: {
    onAfterChange() {},
  },
}
</script>