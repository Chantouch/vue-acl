/**
 * Test a rule with a role group
 * @param {Array} current current roles
 * @param {Array} roles rule to test
 * @return {boolean} validated rule
 */
export const testRole = (current, roles) => {
  if (roles.generate === undefined && !Array.isArray(roles)) {
    console.error('[vue-role] you have invalid roles')
  }

  if (!Array.isArray(roles) && typeof roles.generate !== "undefined") {
    roles = roles.generate()
  }

  let hasAllowed = false
  if (!Array.isArray(roles)) {
    roles = [roles]
  }

  roles.map((rule) => {
    if (rule.includes('*')) hasAllowed = true
  })

  if (hasAllowed) return true

  const checkAnds = roles.map(rule => {
    let valid = true
    rule.map(and => valid = valid && current.includes(and))
    return valid
  })

  let result = false
  checkAnds.map(or => {
    if (or) result = or
  })

  return result
}
