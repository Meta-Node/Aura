<template>
  <button class="filter-button" :class="[active && 'filter-button--active']">
    {{ name }}
    <span v-if="isIcon" class="filter-button__icon">
      <svg
        width="8"
        height="4"
        viewBox="0 0 8 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0L4 4L8 0H0Z" fill="#EEEEEE" />
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
    isIcon: {
      type: Boolean,
      default: true,
    },
  },
}
</script>