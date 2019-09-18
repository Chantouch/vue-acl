"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.upRouter = void 0;

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _checker = require("./checker");

var _store = _interopRequireDefault(require("@/store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * Up vue router middleware
 * @param {VueRouter} router  router object
 * @param {Array} currentGlobal global current permissions
 * @param {string} notfound not fount route path
 */
var upRouter = function upRouter(router, currentGlobal, notfound) {
  if (router === null) return;
  router.beforeEach(function (to, from, next) {
    /** @type {Array} */
    var routePermission = to.meta.role || _store.default.getters["auth/user"].roles;
    if (!(0, _checker.testRole)(currentGlobal, routePermission)) return next(notfound);
    return next();
  });
};

exports.upRouter = upRouter;