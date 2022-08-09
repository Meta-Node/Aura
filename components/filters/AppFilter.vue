<template>
  <div class="filter switch-wrapper">
    <filter-button
      v-for="filter in filters"
      :key="filter.name"
      :active="filter.active"
      :name="filter.name"
      :ordering="filter.type === 'ordering'"
      :reverse="filter.reverse"
      @clicked="onChange"
    />
  </div>
</template>

<script>
import FilterButton from './FilterButton.vue'

export default {
  components: {FilterButton},
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
