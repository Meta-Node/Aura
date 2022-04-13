<template>
  <div class="feedback__quality-slider">
    <h3 class="feedback__quality-title">{{ qualityValue }}</h3>
    <div class="range-slider feedback__quality-slider">
      <input
        :id="id"
        class="feedback__quality-input"
        :type="type"
        :min="min"
        :max="max"
        :step="step"
        :value="newValue"
        @input="onRange"
      />
      <p>
        <span id="percents" class="feedback__percents">{{ percents }}</span>
      </p>
    </div>
    <app-button class="feedback__btn" @click.native="onAfterChange">
      Confirm
    </app-button>
  </div>
</template>

<script>
import AppButton from './AppButton.vue'
export default {
  components: { AppButton },
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
  },

  data() {
    return {
      step: 1,
      percents: 0,
      newValue: 0,
      updatedPercent: 0,
      qualityValue: 'Neutral',
    }
  },

  mounted() {
    if (this.value > 0) {
      this.updateValue(this.value + 1)
      return
    }
    if (this.value === 0.5) {
      this.updateValue(1)
      return
    }

    if (this.value === -0.5) {
      this.updateValue(-1)
      return
    }
    this.updateValue(this.value)
  },

  methods: {
    onRange(e) {
      e.preventDefault()
      this.updateValue(e.target.value)
    },
    onAfterChange() {
      this.updatedPercent = this.percents

      this.$emit('changed', this.updatedPercent)
    },
    updateValue(val) {
      const stepsNames = {
        Sybil: [-4],
        Suspicious: [-3, -2, -1],
        'Bad Vibes': [-0.5],
        Neutral: [0],
        'Good Vibes': [0.5],
        Honest: [1, 2, 3, 4],
      }

      const stepsValues = {
        '-5': -4,
        '-4': -3,
        '-3': -2,
        '-2': -1,
        '-1': -0.5,
        0: 0,
        1: 0.5,
        2: 1,
        3: 2,
        4: 3,
        5: 4,
      }
      this.newValue = val
      this.percents = +stepsValues[val]

      this.qualityValue = Object.keys(stepsNames).find(key =>
        stepsNames[key].includes(this.percents)
      )
    },
  },
}
</script>