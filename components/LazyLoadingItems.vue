<template>
  <infinity-scroll
    :infinity-scroll-active="infinityScrollActive"
    :is-done="isDone"
    @loadMore="onLoadMore"
  >
    <slot />
  </infinity-scroll>
</template>

<script>
import InfinityScroll from './InfinityScroll.vue'

const STEP = 10
export default {
  components: { InfinityScroll },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      infinityScrollActive: true,
      isDone: false,
      currentStep: 1,
      visibleItems: [],
    }
  },
  watch: {
    items() {
      this.isDone = false
      this.infinityScrollActive = true
      this.currentStep = 1
      this.visibleItems = []
      this.$emit('updateItems', this.visibleItems)
    },
  },
  mounted() {
    this.setVisibleItems()
  },
  methods: {
    onLoadMore() {
      if (this.visibleItems.length === this.items.length) {
        this.infinityScrollActive = false
        this.isDone = true
        return
      }

      this.infinityScrollActive = false
      this.setVisibleItems()
      setTimeout(() => {
        this.infinityScrollActive = true
      }, 100)
    },
    setVisibleItems() {
      if (this.items.length <= STEP) {
        this.visibleItems = this.items
        this.$emit('updateItems', this.visibleItems)
        return
      }

      this.visibleItems = [
        ...this.visibleItems,
        ...this.items.slice(
          (this.currentStep - 1) * STEP,
          this.currentStep * STEP
        ),
      ]
      this.currentStep++
      this.$emit('updateItems', this.visibleItems)
    },
  },
}
</script>