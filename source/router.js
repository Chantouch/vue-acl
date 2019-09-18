// @ts-check
import VueRouter from 'vue-router'
import { testRole } from './checker'
import store from "@/store"

/**
 * Up vue router middleware
 * @param {VueRouter} router  router object
 * @param {Array} currentGlobal global current permissions
 * @param {string} notfound not fount route path
 */
export const upRouter = (router, currentGlobal, notfound) => {
  if (router === null) return

  router.beforeEach((to, from, next) => {

    /** @type {Array} */
    const routePermission = to.meta.role || store.getters["auth/user"].roles

    if (!testRole(currentGlobal, routePermission))
      return next(notfound)

    return next()
  })
}
