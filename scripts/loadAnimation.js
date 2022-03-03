import gsap from 'gsap'
import { animations } from './animations'

const noop = () => {}

export const loadAnimation = cb => {
  const $body = document.body
  const $el = document.querySelector('[data-route]')

  const callback = cb || noop

  if (!$el) return

  callback()

  if ($body && !$body.classList.contains('sc-loaded')) {
    gsap.to($body, {
      duration: 0.5,
      opacity: 1,
      onComplete: () => {
        $body.classList.add('sc-loaded')
      },
    })
  }

  animations($el, 2)
}
