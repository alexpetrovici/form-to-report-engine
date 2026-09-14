const assert = require('assert')

const engine = require('../src')

assert.strictEqual(
  typeof engine.buildReport,
  'function'
)

assert.strictEqual(
  typeof engine.normalizeReport,
  'function'
)

assert.strictEqual(
  typeof engine.validateSchema,
  'function'
)

assert.strictEqual(
  typeof engine.validateSubmission,
  'function'
)

assert.strictEqual(
  typeof engine.renderHtml,
  'function'
)

assert.strictEqual(
  typeof engine.renderPdf,
  'function'
)

assert.strictEqual(
  typeof engine.renderReport,
  'function'
)

console.log('public API tests passed.')
