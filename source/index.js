import { _install } from './install'

let options = {
  initial: '',
  router: null,
  notfound: {
    path: '',
    forwardQueryParams: false,
  }
}

let Vue

export const AclInstaller =
(_Vue) => {
  Vue = _Vue
  _install(_Vue, options)
}

export class AclCreate {
  constructor(_options) {
    options = _options
    _install(Vue, options)
  }
}

export class AclRule {
  constructor(role) {
    this.current = role
  }

  or(role) {
    this.current += this.current === '' ? role : `||${role}`
    return this
  }

  and(role) {
    this.current += this.current === '' ? role : `&&${role}`
    return this
  }

  generate() {
    const splitOrs = this.current.split('||')
    return splitOrs.map(o => o.split('&&'))
  }
}
