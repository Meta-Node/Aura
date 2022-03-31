<template>
  <div class="user__slider">
    <input
      :id="id"
      class="user__input-slider"
      :type="type"
      :min="min"
      :max="max"
      :step="step"
      :value="percents"
      @input="onRange"
      @mouseup="onAfterChange"
      @touchend="onAfterChange"
    />
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
}
</script>