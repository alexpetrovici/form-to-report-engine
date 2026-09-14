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
    },
    {
      id: 'photos',
      title: 'Photos',
      type: 'images'
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
  ],
  photos: [
    {
      src: 'data:image/png;base64,AAAA',
      caption: 'Example photo'
    },
    {
      src: 'file:///example/photo.jpg'
    },
    {
      src: 'https://example.test/photo.jpg'
    }
  ]
}

const invalidSubmission = {
  details: {
    name: ''
  },
  items: [
    {}
  ],
  photos: [
    null,
    {
      src: '   '
    }
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

assert(
  invalidResult.errors.includes(
    'Section "photos" image 0 must be an object.'
  )
)

assert(
  invalidResult.errors.includes(
    'Image "photos[1].src" must be a non-empty string.'
  )
)

const nonArrayImagesResult = validateSubmission(
  schema,
  {
    ...validSubmission,
    photos: {
      src: 'data:image/png;base64,AAAA'
    }
  }
)

assert(
  nonArrayImagesResult.errors.includes(
    'Section "photos" must be an array.'
  )
)

console.log('validate-submission tests passed.')
