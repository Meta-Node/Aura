<template>
  <div class="overview">
    <div class="overview__wrapper">
      <div class="overview__filter-wrapper">
        <filter-button name="Sparks" :active="true" />
        <filter-button name="Composite" />
      </div>
      <img
        src="/images/chart.png"
        alt="Diagram"
        class="overview__chart"
        width="291"
        height="276"
      />
      <div class="overview__filter">
        <filter-button name="Name" :active="true" />
        <filter-button name="Amount" />
      </div>
    </div>

    <div class="overview__results">
      <ul class="overview__chart-results">
        <chart-result
          v-for="(user, idx) in 3"
          :key="idx"
          name="Spark 1"
          url="/"
          data-name="5,202,160"
          data-abound="48.7%"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import FilterButton from '~/components/FilterButton.vue'
export default {
  components: { FilterButton },
}
</script>