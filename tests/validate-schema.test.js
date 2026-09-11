const assert = require('assert')

const {
  validateSchema
} = require('../src/core/validate-schema')

const validSchema = {
  id: 'example',
  title: 'Example Report',
  sections: [
    {
      id: 'details',
      title: 'Details',
      type: 'fields',
      fields: []
    }
  ]
}

const invalidSchema = {
  title: 'Broken Report',
  sections: [
    {
      id: 'details',
      title: 'Details',
      type: 'unknown'
    }
  ]
}

const validResult = validateSchema(validSchema)
const invalidResult = validateSchema(invalidSchema)

assert.strictEqual(validResult.valid, true)
assert.deepStrictEqual(validResult.errors, [])

assert.strictEqual(invalidResult.valid, false)

assert(
  invalidResult.errors.length > 0,
  'Invalid schema should return validation errors'
)

console.log('validate-schema tests passed.')