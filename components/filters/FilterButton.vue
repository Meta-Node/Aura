<template>
  <button
    :class="[active && 'filter-button--active']"
    :data-testid="`filter-${name.replace(' ', '')}`"
    class="filter-button"
    @click="onClick"
  >
    {{ name }}
    <span
      v-if="isIcon"
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
    isIcon: {
      type: Boolean,
      default: true,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    onClick() {
      this.$emit('clicked', this.name)
    },
  },
}
</script>
