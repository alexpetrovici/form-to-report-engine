const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

const {
  normalizeReport
} = require('../src/core/normalize-report')

const {
  renderHtml
} = require('../src/renderers/render-html')

const {
  renderPdf
} = require('../src/renderers/render-pdf')

function loadJson(filePath) {
  const absolutePath = path.resolve(__dirname, '..', filePath)
  const content = fs.readFileSync(absolutePath, 'utf-8')

  return JSON.parse(content)
}

async function renderExample(exampleName, browser) {
  const exampleDirectory = `examples/${exampleName}`
  const schema = loadJson(`${exampleDirectory}/schema.json`)
  const submission = loadJson(`${exampleDirectory}/full.json`)
  const brand = loadJson(`${exampleDirectory}/brand.json`)
  const report = normalizeReport(schema, submission, brand)
  const html = renderHtml(report)
  const outputPath = path.resolve(
    __dirname,
    '..',
    'output',
    `${exampleName}-full.pdf`
  )

  await renderPdf(html, { browser, outputPath })

  console.log(`Generated: ${outputPath}`)
}

async function main() {
  const examples = [
    'property-handover',
    'field-service'
  ]
  const browser = await puppeteer.launch()

  try {
    for (const exampleName of examples) {
      await renderExample(exampleName, browser)
    }
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
