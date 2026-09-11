const assert = require('assert')

const {
  buildReport
} = require('../src/core/build-report')

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
    }
  ]
}

const validSubmission = {
  details: {
    name: 'Example User'
  }
}

const invalidSubmission = {
  details: {
    name: ''
  }
}

const report = buildReport(
  schema,
  validSubmission
)

assert.strictEqual(
  report.sections[0].fields[0].value,
  'Example User'
)

assert.throws(
  () => buildReport(schema, invalidSubmission),
  /Invalid report submission/,
  'Invalid submissions should throw by default'
)

const draftReport = buildReport(
  schema,
  invalidSubmission,
  {},
  {
    validateSubmission: false
  }
)

assert.strictEqual(
  draftReport.sections[0].fields[0].value,
  ''
)

console.log('build-report tests passed.')