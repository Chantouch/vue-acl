"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.testRole = void 0;

/**
 * Test a rule with a role group
 * @param {Array} current current roles
 * @param {Array} roles rule to test
 * @return {boolean} validated rule
 */
var testRole = function testRole(current, roles) {
  if (roles.generate === undefined && !Array.isArray(roles)) {
    console.error('[vue-role] you have invalid roles');
  }

  if (!Array.isArray(roles) && typeof roles.generate !== "undefined") {
    roles = roles.generate();
  }

  var hasAllowed = false;

  if (!Array.isArray(roles)) {
    roles = [roles];
  }

  roles.map(function (rule) {
    if (rule.includes('*')) hasAllowed = true;
  });
  if (hasAllowed) return true;
  var checkAnds = roles.map(function (rule) {
    var valid = true;
    rule.map(function (and) {
      return valid = valid && current.includes(and);
    });
    return valid;
  });
  var result = false;
  checkAnds.map(function (or) {
    if (or) result = or;
  });
  return result;
};

exports.testRole = testRole;