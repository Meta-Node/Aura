<template>
  <app-input
    id="search"
    ref="input"
    v-model="value"
    :is-search="true"
    class="header__search"
    data-testid="top-search"
    placeholder="Search..."
    type="text"
  />
</template>

<script>
import AppInput from './AppInput.vue'

export default {
  components: {AppInput},
  computed: {
    value: {
      get() {
        return this.$store.getters["app/searchValue"]
      },
      set(value) {
        this.$store.commit('app/setSearchValue', value)
      }
    }
  },
  methods: {
    resetSearch() {
      this.$refs.input.resetSearch()
    }
  },
}
</script>
