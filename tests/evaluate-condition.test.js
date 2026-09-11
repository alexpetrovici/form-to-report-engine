const assert = require('assert')

const {
  evaluateCondition,
  getValueByPath
} = require('../src/core/evaluate-condition')

const submission = {
  job: {
    status: 'Completed',
    priority: 'High'
  }
}

assert.strictEqual(
  getValueByPath(submission, 'job.status'),
  'Completed'
)

assert.strictEqual(
  evaluateCondition(
    {
      field: 'job.status',
      equals: 'Completed'
    },
    submission
  ),
  true
)

assert.strictEqual(
  evaluateCondition(
    {
      field: 'job.status',
      equals: 'Pending'
    },
    submission
  ),
  false
)

assert.strictEqual(
  evaluateCondition(
    {
      field: 'job.priority',
      notEquals: 'Low'
    },
    submission
  ),
  true
)

console.log('condition tests passed.')