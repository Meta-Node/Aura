<template>
  <div class="range-slider energy-slider">
    <div class="energy-slider__wrapper">
      <input
        :id="id"
        class="energy-slider__energy-input"
        :type="type"
        :min="min"
        :max="max"
        :step="step"
        :value="percents"
        @input="onRange"
      />
      <div class="energy-slider__block"></div>
      <div class="energy-slider__division"></div>
    </div>
    <small id="percents" class="energy-slider__percents">{{ percents }}%</small>
    <app-button class="energy-slider__btn" @click.native="onAfterChange">
      Confirm
    </app-button>
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
  },

  data() {
    return {
      percents: 0,
      updatedPercent: 0,
    }
  },

  methods: {
    onRange(e) {
      this.percents = +e.target.value
    },
    onAfterChange() {
      this.updatedPercent = this.percents
    },
  },
}
</script>