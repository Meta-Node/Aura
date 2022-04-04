<template>
  <div class="explorer__indicator">
    <h3 class="explorer__indicator-text">Your energy</h3>
    <div class="explorer__indicator-wrapper">
      <div
        class="explorer__indicator-line"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
    <div class="explorer__indicator-percents">{{ percent }}%</div>
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
}
</script>