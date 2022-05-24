<template>
  <div
    class="custom-select"
    :tabindex="tabindex"
    @blur="open = false"
  >
    <div
      class="custom-select__selected"
      :class="{ open: open }"
      @click="open = !open"
    >
      {{ name }}
    </div>
    <div
      class="custom-select__items"
      :class="{ selectHide: !open }"
    >
      <div
        v-for="(option, i) of options"
        :key="i"
        class="custom-select__item"
        :class="[selected === option && 'custom-select__item--selected']"
        @click="onSelect(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: false,
    },
    options: {
      type: Array,
      required: true,
    },
    default: {
      type: String,
      required: false,
      default: null,
    },
    tabindex: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  data() {
    return {
      selected: this.default
        ? this.default
        : this.options.length > 0
          ? this.options[0]
          : null,
      open: false,
    }
  },
  mounted() {
    this.$emit('input', this.selected)
  },
  methods: {
    onSelect(option) {
      this.selected = option
      this.open = false
      this.$emit('input', option)
    }
  },
}
</script>
