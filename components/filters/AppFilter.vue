<template>
  <div class="filter switch-wrapper">
    <filter-button
      v-for="filter in filters"
      :key="filter.name"
      :name="filter.name"
      :is-icon="filter.isIcon"
      :active="filter.active"
      :reverse="filter.reverse"
      @clicked="onChange"
    />
  </div>
</template>

<script>
import FilterButton from './FilterButton.vue'
export default {
  components: { FilterButton },
  props: {
    filters: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    onChange(name) {
      this.$emit('filtered', name)
    },
  },
}
</script>