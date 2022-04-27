export default {
  data() {
    return {
      visibleItems: [],
    }
  },

  methods: {
    onUpdateItems(value) {
      this.visibleItems = value
    },
  },
}
