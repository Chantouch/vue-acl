"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AclRule = exports.AclCreate = exports.AclInstaller = void 0;

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

var AclInstaller = function AclInstaller(_Vue) {
  Vue = _Vue;
  (0, _install2._install)(_Vue, options);
};

exports.AclInstaller = AclInstaller;

var AclCreate = function AclCreate(_options) {
  _classCallCheck(this, AclCreate);

  options = _options;
  (0, _install2._install)(Vue, options);
};

exports.AclCreate = AclCreate;

var AclRule =
/*#__PURE__*/
function () {
  function AclRule(role) {
    _classCallCheck(this, AclRule);

    this.current = role;
  }

  _createClass(AclRule, [{
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

  return AclRule;
}();

exports.AclRule = AclRule;