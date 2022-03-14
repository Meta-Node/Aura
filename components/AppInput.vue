<template>
  <div class="input-wrapper">
    <input
      :id="id"
      class="input form__input"
      :class="[
        isSearch && 'form__input--search',
        focus && 'js-focus',
        error && 'js-error',
      ]"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      data-validation="required"
      :value="value"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
    <div v-if="isSearch" class="search-icon">
      <svg
        width="15.6"
        height="15.6"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
          stroke="#F1F1F199"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <small v-if="error" class="form__input-error">{{ validationText }}</small>
  </div>
</template>

<script>
import validator from '~/scripts/utils/Validation'

export default {
  props: {
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
      default: true,
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
  },
  data() {
    return {
      value: '',
      error: false,
      focus: false,
    }
  },

  mounted() {
    this.updateFields()
  },
  methods: {
    updateFields() {
      if (this.value.trim() !== '') {
        this.type !== 'select' && this.$refs.input.focus()
        this.$emit('inputValue', {
          id: this.id,
          value: this.value,
          error: this.error,
        })
      }
      if (this.type === 'textarea') {
        this.textAreaResize(this.$refs.input)
      }
    },
    onInput(e) {
      const target = e.target
      this.value = target.value

      if (this.type === 'textarea') {
        this.textAreaResize(target)
      }

      this.error = this.validationResult().includes(true)

      this.$emit('inputValue', {
        id: this.id,
        value: this.value,
        error: this.error,
      })
    },
    onFocus() {
      this.focus = true
    },

    onBlur() {
      if (!this.value.trim().length) {
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
        return { method, param }
      })

      return validators.map(
        v => !validator[v.method](this.value, v.param && v.param)
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
      this.value = ''
      this.error = false
      this.onBlur()
      this.updateFields()
      if (this.type === 'textarea') {
        this.$refs.input.style.height = 'inherit'
      }
    },
  },
}
</script>