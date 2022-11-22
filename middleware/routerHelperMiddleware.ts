import {Middleware} from '@nuxt/types'

const routerHelperMiddleware: Middleware = function ({store, from, route, redirect}) {
  store.commit('app/setIsFirstVisitedRoute', !from || from.path === route.path)

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

export default routerHelperMiddleware
