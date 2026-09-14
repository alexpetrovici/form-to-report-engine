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

const conditionalSchema = {
  id: 'conditional-example',
  title: 'Conditional Example',
  sections: [
    {
      id: 'notes',
      title: 'Notes',
      type: 'notes',
      visibleWhen: {
        field: 'details.status',
        equals: 'Completed'
      }
    }
  ]
}

const invalidConditionalSchema = {
  id: 'broken-condition',
  title: 'Broken Condition',
  sections: [
    {
      id: 'notes',
      title: 'Notes',
      type: 'notes',
      visibleWhen: {
        field: 'details.status'
      }
    }
  ]
}

const imagesSchema = {
  id: 'images-example',
  title: 'Images Example',
  sections: [
    {
      id: 'photos',
      title: 'Photos',
      type: 'images'
    }
  ]
}

assert.strictEqual(
  validateSchema(conditionalSchema).valid,
  true
)

assert.strictEqual(
  validateSchema(invalidConditionalSchema).valid,
  false
)

assert.strictEqual(
  validateSchema(imagesSchema).valid,
  true
)

console.log('validate-schema tests passed.')
