const assert = require('assert')

const {
  formatValue,
  formatDate
} = require('../src/core/format-value')

assert.strictEqual(
  formatValue('Example', 'text'),
  'Example'
)

assert.strictEqual(
  formatValue(true, 'boolean'),
  'Yes'
)

assert.strictEqual(
  formatValue(false, 'boolean'),
  'No'
)

assert.strictEqual(
  formatDate('2026-09-11'),
  '11/09/2026'
)

assert.strictEqual(
  formatValue('', 'text'),
  ''
)

console.log('format-value tests passed.')