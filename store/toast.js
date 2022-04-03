export const state = () => ({
  /** 
   *@params
    {
      @text String,
      @color 'primary' | 'danger' | 'success',
      @id String
    }
   * */
  toasts: [],
})

export const mutations = {
  addToast(state, value) {
    const updatedValue = { ...value, id: Date.now() }
    state.toasts = [updatedValue, ...state.toasts]
  },
  updateToasts(state, value) {
    state.toasts = value
  },
}
