import { Middleware } from '@nuxt/types'

const redirectsMiddleware: Middleware = function ({ route, redirect }) {
  const redirects = [
    {
      from: '/community',
      to: '/connections',
    },
  ]
  const redirectObj = redirects.find(r => route.path.startsWith(r.from))
  if (redirectObj) {
    return redirect(redirectObj.to)
  }
}

export default redirectsMiddleware
