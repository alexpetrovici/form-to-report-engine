const assert = require('assert')

const {
  normalizeTableRows
} = require('../src/core/normalize-report')

const columns = [
  {
    id: 'date',
    label: 'Date',
    type: 'date'
  },
  {
    id: 'active',
    label: 'Active',
    type: 'boolean'
  }
]

const rows = [
  {
    date: '2026-09-11',
    active: true
  }
]

const normalized = normalizeTableRows(columns, rows)

assert.strictEqual(
  normalized[0].cells[0].displayValue,
  '11/09/2026'
)

assert.strictEqual(
  normalized[0].cells[1].displayValue,
  'Yes'
)

console.log('table formatting tests passed.')