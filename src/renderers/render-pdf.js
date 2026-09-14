const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

/**
 * Renders an HTML document to a PDF buffer.
 *
 * A caller-supplied browser can be reused across multiple renders. Browsers
 * launched by this function are closed automatically.
 */
async function renderPdf(html, options = {}) {
  if (typeof html !== 'string') {
    throw new TypeError('HTML must be a string')
  }

  const {
    browser: suppliedBrowser,
    contentOptions = {},
    launchOptions = {},
    outputPath,
    pdfOptions = {}
  } = options

  const browser = suppliedBrowser || await puppeteer.launch(launchOptions)
  const shouldCloseBrowser = !suppliedBrowser
  let page

  try {
    page = await browser.newPage()

    await page.setContent(html, {
      waitUntil: 'networkidle0',
      ...contentOptions
    })

    const pdf = Buffer.from(await page.pdf({
      format: 'A4',
      printBackground: true,
      ...pdfOptions
    }))

    if (outputPath) {
      const absoluteOutputPath = path.resolve(outputPath)

      await fs.promises.mkdir(path.dirname(absoluteOutputPath), {
        recursive: true
      })
      await fs.promises.writeFile(absoluteOutputPath, pdf)
    }

    return pdf
  } finally {
    try {
      if (page) {
        await page.close()
      }
    } finally {
      if (shouldCloseBrowser) {
        await browser.close()
      }
    }
  }
}

module.exports = {
  renderPdf
}
