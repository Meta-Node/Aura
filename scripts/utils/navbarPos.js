import { raf } from '@emotionagency/utils'

export default class NavbarPos {
  $sc = document.documentElement
  hovered = false

  constructor() {
    this.mouseFunc = e => {
      this.mouseHandler(e)
    }
  }

  init() {
    this.$navbar = document.querySelector('.header')
    this.scrollPos = 0
    this.scrollNav = this.scrollNav.bind(this)
    raf.on(this.scrollNav)
  }

  mouseHandler(e) {
    if (e.screenY <= this.$navbar.scrollHeight + 100) {
      document.body.classList.remove('nav-hidden')
      this.hovered = true
    } else {
      this.hovered = false
      document.body.classList.add('nav-hidden')
    }
  }

  scrollNav() {
    this.top = -this.$sc.scrollTop

    if (this.hovered) {
      return
    }

    this.isVisible && this.addVisibility()

    this.isHidden && this.removeVisibility()

    this.isBg ? this.removeBg() : this.addBg()

    this.scrollPos = -this.$sc.scrollTop
  }

  get isHidden() {
    return this.top < this.scrollPos && -this.scrollPos > 0 && -this.top >= 0
  }

  get isVisible() {
    return this.top > this.scrollPos || this.isFixed
  }

  get isBg() {
    return -this.scrollPos <= window.innerHeight * 0.1
  }

  get isFixed() {
    return window.smoothScroll ? window.smoothScroll.isFixed : false
  }

  addVisibility() {
    document.body.classList.remove('nav-hidden')
    document.removeEventListener('mousemove', this.mouseFunc)
  }

  removeVisibility() {
    document.body.classList.add('nav-hidden')
    document.addEventListener('mousemove', this.mouseFunc)
  }

  addBg() {
    this.$navbar.classList.add('add-bg')
  }

  removeBg() {
    this.$navbar.classList.remove('add-bg')
  }

  destroy() {
    this.scrollPos = 0
    raf.off(this.scrollNav)
  }
}
