<template>
  <app-input
    id="search"
    ref="input"
    :is-search="true"
    class="community__input-wrapper"
    data-testid="top-search"
    placeholder="Search..."
    type="text"
    @inputValue="onInputValue"
  />
</template>

<script>
import AppInput from './AppInput.vue'

export default {
  components: {AppInput},
  data() {
    return {
      value: '',
    }
  },
  methods: {
    onInputValue(data) {
      this.value = data.value.trim()
      this.$emit('searchValue', this.value)
    },
    resetSearch() {
      this.$refs.input.resetSearch()
    }
  },
}
</script>
