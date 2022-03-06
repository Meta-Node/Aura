<template>
  <div class="overview__main">
    <div class="overview__wrapper">
      <div class="overview__filter-wrapper">
        <filter-button name="Sparks" />
        <filter-button name="Composite" />
      </div>
      <img
        src="../static/images/chart.png"
        alt="Diagram"
        class="overview__chart"
      />
      <div class="overview__filter">
        <filter-button name="Name V" />
        <filter-button name="Amount V" />
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