<template>
  <div class="filter switch-wrapper">
    <template
      v-for="filter in filters">
      <filter-select
        v-if="filter.type === 'select'"
        :key="filter.name"
        :label="filter.label"
        :options="filter.options"
        @input="onChange"
      />
      <filter-button
        v-else
        :key="filter.name"
        :active="filter.active"
        :label="filter.label"
        :name="filter.name"
        :ordering="filter.type === 'ordering'"
        :reverse="filter.reverse"
        @clicked="onChange"
      />
    </template>
  </div>
</template>

<script>
import FilterButton from './FilterButton.vue'
import FilterSelect from "~/components/filters/FilterSelect";

export default {
  components: {FilterButton, FilterSelect},
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
