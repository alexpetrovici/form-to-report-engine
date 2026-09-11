const assert = require('assert')
const fs = require('fs')
const path = require('path')

const {
  normalizeReport
} = require('../src/core/normalize-report')

const {
  renderHtml
} = require('../src/renderers/render-html')

function loadJson(filePath) {
  const absolutePath = path.resolve(__dirname, '..', filePath)
  const content = fs.readFileSync(absolutePath, 'utf-8')

  return JSON.parse(content)
}

function buildHtml(name) {
  const schema = loadJson('examples/property-handover/schema.json')
  const submission = loadJson(
    `examples/property-handover/${name}.json`
  )

  const report = normalizeReport(schema, submission)

  return renderHtml(report)
}

const emptyHtml = buildHtml('empty')
const basicHtml = buildHtml('basic')
const fullHtml = buildHtml('full')

assert(
  !emptyHtml.includes('Property Details'),
  'Empty submission should not render Property Details'
)

assert(
  basicHtml.includes('Property Details'),
  'Basic submission should render Property Details'
)

assert(
  basicHtml.includes('Room Inspection'),
  'Basic submission should render Room Inspection'
)

assert(
  !basicHtml.includes('Meter Readings'),
  'Basic submission should not render Meter Readings'
)

assert(
  fullHtml.includes('Meter Readings'),
  'Full submission should render Meter Readings'
)

assert(
  fullHtml.includes('General Notes'),
  'Full submission should render General Notes'
)

assert(
  fullHtml.includes('All keys were handed over during the inspection.'),
  'Full submission should render the notes content'
)

console.log('Renderer assertions passed.')