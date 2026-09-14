const assert = require('assert')

const {
  normalizeReport
} = require('../src/core/normalize-report')

const schema = {
  id: 'example-report',
  version: '1.0',
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
      id: 'notes',
      title: 'Notes',
      type: 'notes',
      keepTogether: true
    },
    {
      id: 'photos',
      title: 'Photos',
      type: 'images',
      pageBreakBefore: true
    }
  ]
}

const submission = {
  details: {
    name: 'Example User'
  },
  notes: 'Example note',
  photos: [
    {
      src: ' data:image/png;base64,AAAA ',
      caption: ' Example photo '
    },
    {
      src: ' https://example.test/photo.jpg '
    }
  ]
}

const report = normalizeReport(schema, submission)

assert.strictEqual(report.id, 'example-report')
assert.strictEqual(report.title, 'Example Report')
assert.strictEqual(report.sections.length, 3)

assert.strictEqual(report.sections[0].visible, true)
assert.strictEqual(report.sections[0].pageBreakBefore, false)
assert.strictEqual(report.sections[0].keepTogether, false)
assert.strictEqual(
  report.sections[0].fields[0].value,
  'Example User'
)

assert.strictEqual(report.sections[1].visible, true)
assert.strictEqual(report.sections[1].keepTogether, true)
assert.strictEqual(
  report.sections[1].value,
  'Example note'
)

assert.strictEqual(report.sections[2].visible, true)
assert.strictEqual(report.sections[2].pageBreakBefore, true)
assert.deepStrictEqual(
  report.sections[2].images,
  [
    {
      src: 'data:image/png;base64,AAAA',
      caption: 'Example photo'
    },
    {
      src: 'https://example.test/photo.jpg',
      caption: ''
    }
  ]
)

assert.throws(
  () => normalizeReport({}, {}),
  /Invalid report schema/,
  'Invalid schemas should throw before normalization'
)

console.log('normalize-report tests passed.')
