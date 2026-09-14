const assert = require('assert')
const fs = require('fs')
const os = require('os')
const path = require('path')

const {
  renderPdf
} = require('../src/renderers/render-pdf')

async function run() {
  await assert.rejects(
    () => renderPdf(),
    {
      name: 'TypeError',
      message: 'HTML must be a string'
    }
  )

  const expectedPdf = Buffer.from('%PDF-1.4 test')
  const calls = {}
  const page = {
    async close() {
      calls.pageClosed = true
    },
    async pdf(options) {
      calls.pdfOptions = options
      return expectedPdf
    },
    async setContent(html, options) {
      calls.html = html
      calls.contentOptions = options
    }
  }
  const browser = {
    async close() {
      calls.browserClosed = true
    },
    async newPage() {
      return page
    }
  }
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'form-to-report-engine-')
  )
  const outputPath = path.join(temporaryDirectory, 'nested', 'report.pdf')

  try {
    const pdf = await renderPdf('<h1>Example</h1>', {
      browser,
      outputPath
    })

    assert(Buffer.isBuffer(pdf), 'Renderer should return a Buffer')
    assert.deepStrictEqual(pdf, expectedPdf)
    assert.strictEqual(calls.html, '<h1>Example</h1>')
    assert.deepStrictEqual(calls.contentOptions, {
      waitUntil: 'networkidle0'
    })
    assert.deepStrictEqual(calls.pdfOptions, {
      format: 'A4',
      printBackground: true
    })
    assert.strictEqual(calls.pageClosed, true)
    assert.strictEqual(calls.browserClosed, undefined)
    assert.deepStrictEqual(fs.readFileSync(outputPath), expectedPdf)
  } finally {
    fs.rmSync(temporaryDirectory, {
      recursive: true,
      force: true
    })
  }
}

run()
  .then(() => {
    console.log('render-pdf tests passed.')
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
