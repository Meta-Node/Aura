const unsavedChangesConfirmation = () =>
  window.confirm(
    'You have unsaved changes.\nClick Cancel to go back to save\nClick OK to leave without saving'
  )

export default {
  computed: {
    hasUnsavedChanges: {
      get() {
        return this.$store.state.app.hasUnsavedChanges
      },
      set(value) {
        this.$store.commit('app/setHasUnsavedChanges', value)
      },
    },
    unsavedChangedEnergies() {
      const prev = this.$store.state.energy.prevTransferedEnergy
      const current = this.$store.state.energy.transferedEnergy
      return prev
        .filter(ep => {
          const curAmount =
            current.find(ec => ec.toBrightId === ep.toBrightId)?.amount || 0
          return curAmount !== ep.amount
        })
        .concat(
          current.filter(ec => {
            const prevAmount =
              prev.find(ep => ep.toBrightId === ec.toBrightId)?.amount || 0
            return prevAmount !== ec.amount
          })
        )
    },
  },
  beforeRouteLeave(_to, _from, next) {
    this.requestUnsavedChangesConfirmation(
      () => {
        next()
      },
      () => {
        next(false)
      }
    )
  },
  methods: {
    requestUnsavedChangesConfirmation(onLeavePage, onCancel) {
      if (this.hasUnsavedChanges) {
        const answer = unsavedChangesConfirmation()
        if (answer) {
          window.onbeforeunload = null
          this.hasUnsavedChanges = false
          onLeavePage()
        } else if (onCancel) {
          onCancel()
        }
      } else {
        window.onbeforeunload = null
        this.hasUnsavedChanges = false
        onLeavePage()
      }
    },
    safeRouterPush(...args) {
      this.requestUnsavedChangesConfirmation(() => {
        this.$router.push(...args)
      })
    },
  },
  mounted() {
    const vinst = this
    window.onbeforeunload = function () {
      if (vinst.hasUnsavedChanges) {
        return 'You have unsaved changes.\nDo you want to leave without saving?'
      }
    }
  },
}
