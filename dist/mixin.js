"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.register = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _store = _interopRequireDefault(require("@/store"));

var _checker = require("./checker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } } function _next(value) { step("next", value); } function _throw(err) { step("throw", err); } _next(); }); }; }

var EventBus = new _vue.default();
var currentGlobal = [];
var not = false;

var register = function register(initial, acceptLocalRoles, globalRoles, router, notfound, middleware) {
  currentGlobal = Array.isArray(initial) ? initial : [initial];

  if (router !== null && middleware) {
    router.beforeEach(function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(to, from, next) {
        var notFoundPath, routePermission;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return middleware({
                  change: function change(a) {
                    currentGlobal = a;
                  }
                });

              case 2:
                // to be backwards compatible (notfound could be string)
                notFoundPath = notfound.path || notfound;

                if (!(to.path === notFoundPath)) {
                  _context.next = 5;
                  break;
                }

                return _context.abrupt("return", next());

              case 5:
                /** @type {Array} */
                if (!('role' in to.meta)) {
                  console.warn("[vue-role] ".concat(to.path, " not have role"));
                }

                routePermission = to.meta.role || _store.default;

                if (routePermission in globalRoles) {
                  routePermission = globalRoles[routePermission];
                }

                if ((0, _checker.testRole)(currentGlobal, routePermission)) {
                  _context.next = 12;
                  break;
                }

                if (!notfound.forwardQueryParams) {
                  _context.next = 11;
                  break;
                }

                return _context.abrupt("return", next({
                  path: notFoundPath,
                  query: to.query
                }));

              case 11:
                return _context.abrupt("return", next(notFoundPath));

              case 12:
                return _context.abrupt("return", next());

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }());
  }

  return {
    /**
     * Called before create component
     */
    beforeCreate: function beforeCreate() {
      var _this = this;

      var self = this;
      this.$role = {
        /**
         * Change current permission
         * @param {string|Array} param
         */
        change: function change(param) {
          param = Array.isArray(param) ? param : [param];

          if (currentGlobal.toString() !== param.toString()) {
            EventBus.$emit('vue-role-changed', param);
          }
        },

        /**
         * get current permission
         */
        get get() {
          return currentGlobal;
        },

        /**
         * reverse current role check
         */
        get not() {
          not = true;
          return this;
        },

        /**
         * Check if role is valid currently
         * @param {string} ruleName role name
         */
        check: function check(ruleName) {
          var hasNot = not;
          not = false;

          if (ruleName in globalRoles) {
            var result = (0, _checker.testRole)(this.get, globalRoles[ruleName]);
            return hasNot ? !result : result;
          }

          if (ruleName in self) {
            if (!acceptLocalRoles) {
              return console.error('[vue-role] acceptLocalRoles is not enabled');
            }

            var _result = (0, _checker.testRole)(this.get, self[ruleName]);

            return hasNot ? !_result : _result;
          }

          return false;
        }
      };
      EventBus.$on('vue-role-changed', function (newPermission) {
        currentGlobal = newPermission;

        if ('onChange' in _this.$role) {
          _this.$role.onChange(currentGlobal);
        }

        _this.$forceUpdate();
      });
    },
    destroyed: function destroyed() {
      var _this2 = this;

      EventBus.$off('vue-role-changed', function (newPermission) {
        currentGlobal = newPermission;

        if ('onChange' in _this2.$role) {
          _this2.$role.onChange(currentGlobal);
        }

        _this2.$forceUpdate();
      });
    }
  };
};

exports.register = register;