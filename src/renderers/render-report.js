const {
  buildReport
} = require('../core/build-report')

const {
  renderHtml
} = require('./render-html')

const {
  renderPdf
} = require('./render-pdf')

/**
 * Builds and renders a report as HTML or PDF.
 */
async function renderReport(
  schema = {},
  submission = {},
  brand = {},
  options = {}
) {
  const {
    format = 'html',
    buildOptions = {},
    ...pdfRendererOptions
  } = options

  if (format !== 'html' && format !== 'pdf') {
    throw new Error(
      `Unsupported report format: "${format}". Expected "html" or "pdf".`
    )
  }

  const report = buildReport(
    schema,
    submission,
    brand,
    buildOptions
  )
  const html = renderHtml(report)

  if (format === 'html') {
    return html
  }

  return renderPdf(html, pdfRendererOptions)
}

module.exports = {
  renderReport
}
