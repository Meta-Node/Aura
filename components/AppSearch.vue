<template>
  <app-input
    id="search"
    ref="input"
    class="community__input-wrapper"
    type="text"
    placeholder="Search..."
    :is-search="true"
    @inputValue="onInputValue"
  />
</template>

<script>
import AppInput from './AppInput.vue'
export default {
  components: { AppInput },
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