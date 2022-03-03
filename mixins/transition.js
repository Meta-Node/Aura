import gsap from 'gsap'
import imagesLoaded from 'imagesloaded'
import { resetScroll } from '~/scripts/utils/resetScroll'
import { loadAnimation } from '~/scripts/loadAnimation'

export default {
  transition() {
    return {
      mode: 'out-in',
      enter(el, done) {
        resetScroll()

        const onLoad = () => {
          gsap.fromTo(
            el,
            { opacity: 0 },
            { duration: 0.5, opacity: 1, onComplete: done }
          )
          loadAnimation()
        }

          onLoad()
      },
      leave(el, done) {
        window.ss && (window.ss.isFixed = true)
        gsap.to(el, {
          duration: 0.5,
          opacity: 0,
          onComplete: done,
        })
      },
    }
  },

  computed: {
    isLoaded() {
      return this.$store.state.app.loaded
    },
  },
  watch: {
    isLoaded() {
      if (this.isLoaded) {
        loadAnimation()
      }
    },
  },
}
