const assert = require('assert')

const {
  getDisplayValue
} = require('../src/core/get-display-value')

assert.strictEqual(
  getDisplayValue('Example'),
  'Example'
)

assert.strictEqual(
  getDisplayValue(''),
  '—'
)

assert.strictEqual(
  getDisplayValue(null),
  '—'
)

assert.strictEqual(
  getDisplayValue(undefined),
  '—'
)

assert.strictEqual(
  getDisplayValue('', 'Not provided'),
  'Not provided'
)

console.log('get-display-value tests passed.')