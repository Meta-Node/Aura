<template>
  <div class="input-wrapper">
    <textarea
      v-if="type === 'textarea'"
      :id="id"
      ref="input"
      :class="[
        isSearch && 'form__input--search',
        focus && 'js-focus',
        error && 'js-error',
      ]"
      :data-testid="dataTestid"
      :placeholder="placeholder"
      :required="required"
      :type="type"
      :value="localValue"
      class="input form__input"
      data-validation="required"
      rows="5"
      @blur="onBlur"
      @focus="onFocus"
      @input="onInput"
    ></textarea>
    <input
      v-else
      :id="id"
      ref="input"
      :class="[
        isSearch && 'form__input--search',
        focus && 'js-focus',
        error && 'js-error',
      ]"
      :data-testid="dataTestid"
      :placeholder="placeholder"
      :required="required"
      :type="type"
      :value="localValue"
      class="input form__input"
      data-validation="required"
      @blur="onBlur"
      @focus="onFocus"
      @input="onInput"
    />
    <div v-if="isSearch" class="search-icon">
      <svg
        fill="none"
        height="15.6"
        viewBox="0 0 20 20"
        width="15.6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
          stroke="#F1F1F199"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </div>
    <transition mode="out-in" name="fade">
      <button
        v-if="isSearch && localValue.trim().length"
        aria-label="reset search localValue"
        class="reset-search"
        @click="resetSearch"
      >
        <svg
          fill="none"
          height="18"
          viewBox="0 0 17 18"
          width="17"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            d="M8.5 17.5C13.1944 17.5 17 13.6943 17 9C17 4.30566 13.1944 0.5 8.5 0.5C3.80557 0.5 0 4.30566 0 9C0 13.6943 3.80557 17.5 8.5 17.5ZM12.2657 5.23438C12.5781 5.54663 12.5781 6.05322 12.2657 6.36572L9.63138 9L12.2657 11.6343C12.5781 11.9468 12.5781 12.4534 12.2657 12.7656C11.9533 13.0781 11.4467 13.0781 11.1343 12.7656L8.5 10.1313L5.86569 12.7656C5.55328 13.0781 5.04675 13.0781 4.73431 12.7656C4.42191 12.4534 4.42191 11.9468 4.73431 11.6343L7.36862 9L4.73431 6.36572C4.42191 6.05322 4.42191 5.54663 4.73431 5.23438C5.04672 4.92188 5.55325 4.92188 5.86569 5.23438L8.5 7.86865L11.1343 5.23438C11.4467 4.92188 11.9533 4.92188 12.2657 5.23438Z"
            fill="#8E8E93"
            fill-rule="evenodd"
          />
        </svg>
      </button>
    </transition>
    <small v-if="error" class="form__input-error">{{ validationText }}</small>
  </div>
</template>

<script>
import validator from '~/scripts/utils/Validation'

export default {
  props: {
    value: {
      type: String,
      default: ''
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
  },
  data() {
    return {
      error: false,
      focus: false,
      localValue: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(newValue, _oldValue) {
        if (newValue) {
          this.localValue = newValue
        }
      }
    }
  },
  mounted() {
    this.updateFields()
  },
  methods: {
    updateFields() {
      if (this.localValue.trim() !== '') {
        this.type !== 'select' && this.$refs.input.focus()
        this.emitValue()
      }
      // if (this.type === 'textarea') {
      //   this.textAreaResize(this.$refs.input)
      // }
    },
    onInput(e) {
      const target = e.target
      this.localValue = target.value

      // if (this.type === 'textarea') {
      //   this.textAreaResize(target)
      // }

      this.error = this.validationResult().includes(true)

      this.emitValue()
    },
    onFocus() {
      this.focus = true
    },

    onBlur() {
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
    }
  },
}
</script>
