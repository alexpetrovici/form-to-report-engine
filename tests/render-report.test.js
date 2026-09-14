const assert = require('assert')

const {
  renderReport
} = require('../src/renderers/render-report')

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

const submission = {
  details: {
    name: 'Example User'
  }
}

async function run() {
  const html = await renderReport(schema, submission)

  assert.strictEqual(typeof html, 'string')
  assert(html.includes('Example Report'))
  assert(html.includes('Example User'))

  await assert.rejects(
    () => renderReport(schema, submission, {}, {
      format: 'xml'
    }),
    /Unsupported report format: "xml"\. Expected "html" or "pdf"\./
  )

  const expectedPdf = Buffer.from('%PDF-1.4 report')
  const calls = {}
  const browser = {
    async newPage() {
      return {
        async close() {},
        async pdf(options) {
          calls.pdfOptions = options
          return expectedPdf
        },
        async setContent(renderedHtml, options) {
          calls.html = renderedHtml
          calls.contentOptions = options
        }
      }
    }
  }

  const pdf = await renderReport(schema, submission, {}, {
    browser,
    contentOptions: {
      waitUntil: 'load'
    },
    format: 'pdf',
    pdfOptions: {
      format: 'Letter'
    }
  })

  assert.deepStrictEqual(pdf, expectedPdf)
  assert(calls.html.includes('Example Report'))
  assert(calls.html.includes('Example User'))
  assert.deepStrictEqual(calls.contentOptions, {
    waitUntil: 'load'
  })
  assert.deepStrictEqual(calls.pdfOptions, {
    format: 'Letter',
    printBackground: true
  })
}

run()
  .then(() => {
    console.log('render-report tests passed.')
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
