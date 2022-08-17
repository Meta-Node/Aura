<template>
  <div class="select-wrapper">
    <div class="select">
      <div class="select__input" @click="() => (showOptions = !showOptions)">
        <p v-if="selectedItem" class="select__input__selected-item">
          {{ selectedItem.title }}
        </p>
        <p v-else class="select__input__placeholder">{{ placeholder }}</p>
      </div>
      <p
        :class="{ 'select__icon--rotated': showOptions }"
        class="select__icon"
        @click="() => (showOptions = !showOptions)"
      >
        >
      </p>
      <div v-if="showOptions" class="select__options">
        <div
          v-for="option in options"
          :key="option.id"
          class="select__options__option"
          @click="handleSelect(option)"
        >
          {{ option.title }}
        </div>
      </div>
    </div>
    <small v-if="error" class="form__input-error">{{ validationText }}</small>
  </div>
</template>

<script>
import validator from '~/scripts/utils/Validation'

export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: 'text',
    },
    required: {
      type: Boolean,
      default: false,
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    validation: {
      type: String,
      default: '',
    },
    validationText: {
      type: String,
    },
    dataTestid: {
      type: String,
    },
    options: {
      type: Array,
      default: () => [],
    },
    selectedItem: {
      type: Object,
    },
  },
  data() {
    return {
      error: false,
      focus: false,
      localValue: '',
      showOptions: false,
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, _oldValue) {
        if (newValue) {
          this.localValue = newValue
        }
      },
    },
  },
  mounted() {
    this.updateFields()
  },
  methods: {
    handleSelect(item) {
      this.$emit('handleItemClicked', item)
      this.showOptions = false
    },
    updateFields() {
      if (this.localValue.trim() !== '') {
        this.type !== 'select' && this.$refs.input.focus()
        this.emitValue()
      }
    },
    onInput(e) {
      const target = e.target
      this.localValue = target.value
      this.error = this.validationResult().includes(true)
      this.emitValue()
    },
    onFocus() {
      this.focus = true
    },

    onBlur() {
      console.log('this.localValue')
      console.log(this.localValue)
      if (!this.localValue.trim().length) {
        this.focus = false
      }
    },

    togglePass() {
      this.isShow = !this.isShow
    },

    validationResult() {
      if (!this.validation) {
        return [false]
      }
      const options = this.validation.split(' ')

      const validators = options.map(option => {
        const method = option.replace(/[\d(].{0,}/gm, '')
        const param = option.replace(/.{0,}\(|\)/gm, '')
        return {method, param}
      })

      return validators.map(
        v => !validator[v.method](this.localValue, v.param && v.param)
      )
    },
    throwError() {
      if (this.validationResult().includes(true)) {
        this.focus = true
        this.error = true
        this.$refs.input.focus()
      }
    },
    textAreaResize(el) {
      el.style.height = 'inherit'
      const height = el.scrollHeight + 1 + 'px'
      el.style.height = height
      this.$el.style.setProperty('--height', height)
    },
    reset() {
      this.localValue = ''
      this.error = false
      this.onBlur()
      this.updateFields()
      if (this.type === 'textarea') {
        this.$refs.input.style.height = 'inherit'
      }
    },
    resetSearch() {
      this.reset()
      this.emitValue()
    },
    emitValue() {
      this.$emit('input', this.localValue)
      this.$emit('inputValue', {
        id: this.id,
        value: this.localValue,
        error: this.error,
      })
    },
  },
}
</script>
