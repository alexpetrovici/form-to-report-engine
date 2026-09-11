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

function runExample(exampleName, submissionName) {
  const exampleDirectory = `examples/${exampleName}`

  const schema = loadJson(`${exampleDirectory}/schema.json`)
  const submission = loadJson(
    `${exampleDirectory}/${submissionName}.json`
  )
  const brand = loadJson(`${exampleDirectory}/brand.json`)

  const report = normalizeReport(schema, submission, brand)
  const html = renderHtml(report)

  const outputPath = writeOutput(
    `${exampleName}-${submissionName}.html`,
    html
  )

  console.log(`Generated: ${outputPath}`)
}

const examples = [
  'property-handover',
  'field-service'
]

const submissions = [
  'empty',
  'basic',
  'full'
]

examples.forEach((exampleName) => {
  submissions.forEach((submissionName) => {
    runExample(exampleName, submissionName)
  })
})