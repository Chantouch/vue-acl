"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Role = exports.RoleCreate = exports.RoleInstaller = void 0;

var _install2 = require("./install");

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var options = {
  initial: '',
  router: null,
  notfound: {
    path: '',
    forwardQueryParams: false
  }
};
var Vue;

var RoleInstaller = function RoleInstaller(_Vue) {
  Vue = _Vue;
  (0, _install2._install)(_Vue, options);
};

exports.RoleInstaller = RoleInstaller;

var RoleCreate = function RoleCreate(_options) {
  _classCallCheck(this, RoleCreate);

  options = _options;
  (0, _install2._install)(Vue, options);
};

exports.RoleCreate = RoleCreate;

var Role =
/*#__PURE__*/
function () {
  function Role(role) {
    _classCallCheck(this, Role);

    this.current = role;
  }

  _createClass(Role, [{
    key: "or",
    value: function or(role) {
      this.current += this.current === '' ? role : "||".concat(role);
      return this;
    }
  }, {
    key: "and",
    value: function and(role) {
      this.current += this.current === '' ? role : "&&".concat(role);
      return this;
    }
  }, {
    key: "generate",
    value: function generate() {
      var splitOrs = this.current.split('||');
      return splitOrs.map(function (o) {
        return o.split('&&');
      });
    }
  }]);

  return Role;
}();

exports.Role = Role;