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

function writeOutput(fileName, content) {
  const outputDirectory = path.resolve(__dirname, '..', 'output')

  fs.mkdirSync(outputDirectory, {
    recursive: true
  })

  const outputPath = path.join(outputDirectory, fileName)

  fs.writeFileSync(outputPath, content, 'utf-8')

  return outputPath
}

function runExample(name) {
  const schema = loadJson('examples/property-handover/schema.json')
  const submission = loadJson(
    `examples/property-handover/${name}.json`
  )

  const report = normalizeReport(schema, submission)
  const html = renderHtml(report)

  const outputPath = writeOutput(
    `property-handover-${name}.html`,
    html
  )

  console.log(`Generated: ${outputPath}`)
}

runExample('empty')
runExample('basic')
runExample('full')