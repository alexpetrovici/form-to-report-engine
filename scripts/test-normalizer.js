const fs = require('fs')
const path = require('path')

const {
  normalizeReport
} = require('../src/core/normalize-report')

function loadJson(filePath) {
  const absolutePath = path.resolve(__dirname, '..', filePath)
  const content = fs.readFileSync(absolutePath, 'utf-8')

  return JSON.parse(content)
}

function runExample(name) {
  const schema = loadJson('examples/property-handover/schema.json')
  const submission = loadJson(`examples/property-handover/${name}.json`)

  const report = normalizeReport(schema, submission)

  console.log(`\n=== ${name.toUpperCase()} ===\n`)
  console.dir(report, {
    depth: null,
    colors: true
  })
}

runExample('empty')
runExample('basic')
runExample('full')