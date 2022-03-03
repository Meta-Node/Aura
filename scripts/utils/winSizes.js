export const winSizes = () => {
  const vh = window.innerHeight
  const vw = window.innerWidth
  const oprientation = vh > vw ? 'portrait' : 'landscape'

  document.body.style.setProperty('--vh', `${vh}px`)
  document.body.style.setProperty('--vw', `${vw}px`)
  document.body.style.setProperty('--oprientation', `${oprientation}`)
}
