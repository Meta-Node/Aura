import { MutationTree } from 'vuex'
import { ToastState } from '~/types/store'

export const state = (): ToastState => ({
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

export const mutations: MutationTree<ToastState> = {
  addToast(state, value) {
    const updatedValue = { ...value, id: Date.now() }
    state.toasts = [updatedValue, ...state.toasts]
  },
  updateToasts(state, value) {
    state.toasts = value
  },
}
