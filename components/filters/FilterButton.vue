<template>
  <button
    :class="[active && 'filter-button--active']"
    :data-testid="testId"
    class="filter-button"
    @click="onClick"
  >
    {{ name }}
    <span
      v-if="ordering"
      :style="{ transform: reverse ? 'rotate(180deg)' : 'rotate(0deg)' }"
      class="filter-button__icon"
    >
      <svg
        fill="none"
        height="4"
        viewBox="0 0 8 4"
        width="8"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0L4 4L8 0H0Z" fill="#EEEEEE"/>
      </svg>
    </span>
  </button>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: 'Name',
    },
    active: {
      type: Boolean,
      default: false,
    },
    ordering: {
      type: Boolean,
      default: true,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    testId() {
      const id = `filter-${this.name.replace(' ', '')}`
      if (!this.active) return `${id}-inactive`
      if (!this.ordering) return `${id}-active`
      if (!this.reverse) return `${id}-descending`
      return `${id}-ascending`
    }
  },

  methods: {
    onClick() {
      this.$emit('clicked', this.name)
    },
  },
}
</script>
