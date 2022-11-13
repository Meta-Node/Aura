<template>
  <div class="feedback__quality-slider">
    <h3 class="feedback__quality-title" data-testid="feedback-quality-value">{{ qualityValue }}</h3>
    <div class="feedback__quality-slider">
      <div class="feedback__quality-slider-slider">
        <label :for="id" class="feedback__quality-label">
        <span
          :style="{ width: prevPercent + '%' }"
          class="feedback__quality-prev-value"
        ></span>
          <input
            :id="id"
            :max="max"
            :min="min"
            :step="step"
            :type="type"
            :value="newValue"
            class="feedback__quality-input"
            data-testid="feedback-quality-input"
            @input="onRange"
          />
        </label>
      </div>
      <p>
        <span id="percents" class="feedback__percents">{{ percents }}</span>
      </p>
    </div>
  </div>
</template>

<script>
import {getStepName, getStepValue, valueToStep} from "~/utils/rating";

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
    value: {
      type: Number,
      default: 0,
    },
    prevValue: {
      type: Number,
    },
  },

  data() {
    return {
      prevPercent: 0,
      step: 1,
      percents: 0,
      newValue: 0,
      updatedPercent: 0,
      qualityValue: 'Neutral',
    }
  },

  watch: {
    updatedPercent() {
      this.updatePrevValue(+this.newValue)
    },
  },

  mounted() {
    this.setupValue()
    this.updatePrevValue(+this.newValue)
  },

  methods: {
    setupValue() {
      this.updateValue(valueToStep[this.value])
    },
    updatePrevValue(value) {
      if (!this.prevValue) {
        return
      }

      const possibleValues = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]

      possibleValues.forEach((val, idx) => {
        if (val === value) {
          this.prevPercent = (idx / 10) * 100
        }
      })
    },
    onRange(e) {
      e.preventDefault()
      this.updateValue(e.target.value)
    },
    onAfterChange() {
      this.updatedPercent = this.percents

      this.$emit('submit', this.updatedPercent)
    },
    updateValue(val) {
      this.newValue = val
      this.percents = getStepValue(val)
      this.$emit('input', this.percents)
      this.qualityValue = getStepName(this.percents)
    },
  },
}
</script>
