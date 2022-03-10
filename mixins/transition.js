import gsap from 'gsap'

export default {
  transition() {
    return {
      mode: 'out-in',
      enter(el, done) {
        gsap.fromTo(
          el,
          { opacity: 0 },
          { duration: 0.25, opacity: 1, onComplete: done }
        )
      },
      leave(el, done) {
        gsap.to(el, {
          duration: 0.25,
          opacity: 0,
          onComplete: done,
        })
      },
    }
  },
}
