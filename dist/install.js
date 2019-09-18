"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._install = void 0;

var _mixin = require("./mixin");

var _install = function _install(_Vue, options) {
  var initial = options.initial,
      acceptLocalRoles = options.acceptLocalRoles,
      globalRoles = options.globalRoles,
      router = options.router,
      notfound = options.notfound,
      middleware = options.middleware;

  _Vue.mixin((0, _mixin.register)(initial, acceptLocalRoles || false, globalRoles || {}, router, notfound, middleware));
};

exports._install = _install;