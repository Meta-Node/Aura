<template>
  <div class="user">
    <div class="user__slider">
      <div
        class="user__slider__action"
        @click="decrease">-
      </div>
      <input
        v-model="localValue"
        :data-testid="`user-slider-${userId}-input`"
        class="user__slider__input"
        type="number"/>
      <div
        class="user__slider__action"
        @click="increase">+
      </div>
    </div>
    <small id="percents" :data-testid="`user-slider-${userId}-percentage`"
           class="user__percents">{{ outboundPercentage }}%</small>
  </div>
</template>

<script>
import energy from '~/mixins/energy'

export default {
  mixins: [energy],
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
    quota: {
      type: Number,
      default: 100,
    },
    value: {
      type: Number,
    },
  },
  data() {
    return {
      values: [0, 1, 2, 5, 25, 100],
      localValue: 0,
    }
  },
  computed: {
    // used in energy mixin
    outbound() {
      return this.value
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, _oldValue) {
        console.log('watch ' + newValue)
        this.localValue = newValue
      }
    },
    localValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        let finalValue = Math.min(newValue, this.max);
        finalValue = Math.max(finalValue, this.min);
        if (newValue !== finalValue) {
          this.localValue = finalValue
        } else {
          this.$emit('input', newValue)
        }
      }
    }
  },
  methods: {
    increase() {
      for (let i = 0; i < this.values.length; i++) {
        if (this.values[i] > this.value) {
          this.$emit('input', this.values[i])
          return
        }
      }
    },
    decrease() {
      for (let i = this.values.length - 1; i >= 0; i--) {
        if (this.values[i] < this.value) {
          this.$emit('input', this.values[i])
          return
        }
      }
    },
  },
}
</script>
