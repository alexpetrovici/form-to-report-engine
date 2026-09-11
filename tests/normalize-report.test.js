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
      type: 'notes'
    }
  ]
}

const submission = {
  details: {
    name: 'Example User'
  },
  notes: 'Example note'
}

const report = normalizeReport(schema, submission)

assert.strictEqual(report.id, 'example-report')
assert.strictEqual(report.title, 'Example Report')
assert.strictEqual(report.sections.length, 2)

assert.strictEqual(report.sections[0].visible, true)
assert.strictEqual(
  report.sections[0].fields[0].value,
  'Example User'
)

assert.strictEqual(report.sections[1].visible, true)
assert.strictEqual(
  report.sections[1].value,
  'Example note'
)

console.log('normalize-report tests passed.')