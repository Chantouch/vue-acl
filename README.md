# vue-role: access control list in vuejs

> We will help you to control the permission of access in your app for yours components and routes 

## Installation

```bash
# yarn
yarn add vue-role
# npm
npm install vue-role --save
```

## Get Started

Create the `role.js` file to define your role settings and global rules:

```javascript
import Vue from 'vue'
import { RoleInstaller, RoleCreate, Role } from 'vue-role'
import router from './router'

Vue.use(RoleInstaller)

export default new RoleCreate({
  initial: 'public',
  notfound: {
    path: '/error',
    forwardQueryParams: true,
  },
  router,
  acceptLocalRoles: true,
  globalRoles: {
    isAdmin: new Role('admin').generate(),
    isPublic: new Role('public').or('admin').generate(),
    isLogged: new Role('user').and('inside').generate()
  },
  middleware: async role => {
    await timeout(2000) // call your api
    role.change('admin')
  }
})
```

More details:

- **RoleInstaller**: plugin class for install in Vue with Vue.use
- **RoleCreate**: class to define role settings
  - **initial**: first permission, for startup with your app
  - **notfound**: route for 404 error, add `forwardQueryParams: true` if you want to forward all query params,
  - **router**: your VueRouter instance
  - **acceptLocalRoles**: if you can define new rules inside vue components
  - **globalRoles**: define globals rules for access in routes and any components
  - **middleware**: async method executed in all route change event, to get user in your api and change permission
- **Role**: class with rule builder, the instance receive initial permission.
  - **or**: method for add OR condition in rule, e.g: if current permission is public OR admin the rule isPublic equals true
  - **and**: method for add AND condition in rule, e.g: if current permission contains user AND inside the rule isLogged equals true
  - **generate**: this method should called to create and compile your rule query

In your `router.js` file, you can define permissions for yours routes:

```javascript
import Vue from 'vue'
import Router from 'vue-router'
import { Role } from 'vue-role'

import Public from './views/Public.vue'
import Admin from './views/Admin.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'public',
      component: Public,
      meta: {
        rule: 'isPublic'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        rule: new Role('admin').generate()
      }
    },
    {
      path: '/error',
      name: 'notfound',
      component: NotFound,
      meta: {
        rule: '*'
      }
    }
  ]
})
```

More details:
- Define `rule` meta for link a route with a permission, your can use name of the global rule e.g `isPublic` or use `Role` for create new rule orr use `*` for define allowed route.

For finish, in your `main.js` import the `role` and pass to Vue root instance:

```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import role from './role'

Vue.config.productionTip = false

new Vue({
  router,
  role,
  render: h => h(App)
}).$mount('#app')
```

## Use in components

If you defined `acceptLocalRoles` as `true`, you can define computed properties with new rules, but this rules works only in component:

```javascript
import { Role } from 'vue-role'

export default {
  computed: {
    isLocalRole () {
      return new Role('create').generate()
    }
  }
}
```

You can also check rules for display custom elements in your layout:

```html
<button v-if="$role.not.check('isAdmin')">
  Set admin permisson
</button>
<button v-else>
  Set public permission
</button>
```

E.g: if `isAdmin` is **not** true the button 'Set admin permisson' is displayed.

Finish, you can change current permission in any component using `change` method:

```html
<button v-if="$role.not.check('isAdmin')" @click="$role.change('admin')">
  Set admin permisson
</button>
<button v-else @click="$role.change('public')">
  Set public permission
</button>
```

In your component can add observer for current Role:
```javascript
mounted () {
  this.$role.onChange = newPermission => {
    console.log('Has changed to', newPermission)
  }
}
```
