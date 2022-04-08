<template>
  <div class="explorer-energy">
    <h3 class="explorer-energy__indicator-text">Your energy</h3>
    <div class="explorer-energy__indicator-wrapper">
      <div
        class="explorer-energy__indicator-line"
        :style="{ width: percent + '%' }"
      ></div>
    </div>
    <div class="explorer-energy__indicator-percents">
      {{ percent >= 0 ? percent : 0 }}%
    </div>
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