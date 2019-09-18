// @ts-check
import Vue from 'vue'
import store from "@/store"

import { testRole } from './checker'

const EventBus = new Vue()

let currentGlobal = []
let not = false


export const register = (initial, acceptLocalRoles, globalRoles, router, notfound, middleware) => {
  currentGlobal = Array.isArray(initial) ? initial : [initial]

  if (router !== null && middleware) {
    router.beforeEach(async (to, from, next) => {
      await middleware({
        change (a) {
          currentGlobal = a
        }
      })

      // to be backwards compatible (notfound could be string)
      const notFoundPath = notfound.path || notfound;
      if (to.path === notFoundPath) return next()

      /** @type {Array} */
      if (!('role' in to.meta)) {
        console.warn(`[vue-role] ${to.path} not have role`)
      }

      let routePermission = to.meta.role || store.getters["auth/user"].roles

      if (routePermission in globalRoles) {
        routePermission = globalRoles[routePermission]
      }

      if (!testRole(currentGlobal, routePermission)) {
        // check if forwardQueryParams is set
        if (notfound.forwardQueryParams) {
          return next({ path: notFoundPath, query: to.query })
        }
        return next(notFoundPath)
      }
      return next()
    })
  }

  return {
    /**
     * Called before create component
     */
    beforeCreate () {
      const self = this

      this.$role = {
        /**
         * Change current permission
         * @param {string|Array} param
         */
        change (param) {
          param = Array.isArray(param) ? param : [param]
          if (currentGlobal.toString() !== param.toString()) {
            EventBus.$emit('vue-role-changed', param)
          }
        },

        /**
         * get current permission
         */
        get get () {
          return currentGlobal
        },

        /**
         * reverse current role check
         */
        get not () {
          not = true
          return this
        },

        /**
         * Check if role is valid currently
         * @param {string} ruleName role name
         */
        check (ruleName) {
          const hasNot = not
          not = false

          if (ruleName in globalRoles) {
            const result = testRole(this.get, globalRoles[ruleName])
            return hasNot ? !result : result
          }


          if (ruleName in self) {
            if (!acceptLocalRoles) {
              console.error('[vue-role] acceptLocalRoles is not enabled')
            }

            const result = testRole(this.get, self[ruleName])
            return hasNot ? !result : result
          }

          return false
        }
      }

      EventBus.$on('vue-role-changed', newPermission => {
        currentGlobal = newPermission
        if ('onChange' in this.$role) {
          this.$role.onChange(currentGlobal)
        }
        this.$forceUpdate()
      })
    },
    destroyed () {
      EventBus.$off('vue-role-changed', newPermission => {
        currentGlobal = newPermission
        if ('onChange' in this.$role) {
          this.$role.onChange(currentGlobal)
        }
        this.$forceUpdate()
      })
    }
  }
}
