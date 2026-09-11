const assert = require('assert')

const {
  validateSubmission
} = require('../src/core/validate-submission')

const schema = {
  id: 'example',
  title: 'Example Report',
  sections: [
    {
      id: 'details',
      title: 'Details',
      type: 'fields',
      fields: [
        {
          id: 'name',
          label: 'Name',
          type: 'text',
          required: true
        }
      ]
    },
    {
      id: 'items',
      title: 'Items',
      type: 'repeatable',
      fields: [
        {
          id: 'description',
          label: 'Description',
          type: 'text',
          required: true
        }
      ]
    }
  ]
}

const validSubmission = {
  details: {
    name: 'Example User'
  },
  items: [
    {
      description: 'Example item'
    }
  ]
}

const invalidSubmission = {
  details: {
    name: ''
  },
  items: [
    {}
  ]
}

const validResult = validateSubmission(schema, validSubmission)
const invalidResult = validateSubmission(schema, invalidSubmission)

assert.strictEqual(validResult.valid, true)
assert.deepStrictEqual(validResult.errors, [])

assert.strictEqual(invalidResult.valid, false)

assert(
  invalidResult.errors.includes(
    'Required field "details.name" is missing.'
  )
)

assert(
  invalidResult.errors.includes(
    'Required field "items[0].description" is missing.'
  )
)

console.log('validate-submission tests passed.')