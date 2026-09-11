function evaluateCondition(condition, submission = {}) {
  if (!condition) {
    return true
  }

  const {
    field,
    equals,
    notEquals
  } = condition

  if (!field || typeof field !== 'string') {
    return false
  }

  const value = getValueByPath(submission, field)

  if (Object.prototype.hasOwnProperty.call(condition, 'equals')) {
    return value === equals
  }

  if (Object.prototype.hasOwnProperty.call(condition, 'notEquals')) {
    return value !== notEquals
  }

  return false
}

function getValueByPath(source = {}, path = '') {
  return path
    .split('.')
    .filter(Boolean)
    .reduce((current, key) => {
      if (
        current === undefined ||
        current === null ||
        typeof current !== 'object'
      ) {
        return undefined
      }

      return current[key]
    }, source)
}

module.exports = {
  evaluateCondition,
  getValueByPath
}