import { register } from './mixin'

export const _install = (_Vue, options) => {
  const { initial, acceptLocalRoles, globalRoles, router, notfound, middleware } = options

  _Vue.mixin(
    register(
      initial,
      acceptLocalRoles || false,
      globalRoles || {},
      router,
      notfound,
      middleware
    )
  )
}
