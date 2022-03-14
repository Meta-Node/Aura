class Validation {
  required(str) {
    return !!str.trim()
  }

  minLength(str, value) {
    if (str.trim().length < value) {
      return false
    }
    return true
  }

  email(str) {
    const regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
    const isEmailValid = regExp.test(str.trim())
    if (!isEmailValid) {
      return false
    }
    return true
  }

  maxlength(str, value) {
    const l = str.trim().length
    if (l > value) {
      return false
    }
    return true
  }

  isEqual(str, value) {
    if (str.trim() !== value.trim()) {
      return false
    }
    return true
  }
}

export default new Validation()
