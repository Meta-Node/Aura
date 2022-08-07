<template>
  <div
    :tabindex="tabindex"
    class="custom-select"
    @blur="open = false"
  >
    <div
      :class="{ open: open }"
      class="custom-select__selected"
      data-testid="custom-select"
      @click="open = !open"
    >
      {{ name }}
    </div>
    <div
      :class="{ selectHide: !open }"
      class="custom-select__items"
    >
      <div
        v-for="(option, i) of options"
        :key="i"
        :class="[selected === option && 'custom-select__item--selected']"
        :data-testid="`custom-select-option-${option.replace(' ' , '')}`"
        class="custom-select__item"
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
