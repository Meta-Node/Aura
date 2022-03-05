<template>
  <div class="range-slider feedback__quality-slider">
    <input
      :id="id"
      class="feedback__quality-input"
      :type="type"
      :min="min"
      :max="max"
      :step="step"
      :value="percents"
      @input="onRange"
    />
    <p><span id="percents" class="feedback__percents">{{percents}}</span></p>
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
    }
  },

  methods: {
    onRange (e) {
      this.percents = +e.target.value
    }
  },
}
</script>