# form-to-report-engine

Open-source, schema-driven Node.js engine for turning structured form data into branded HTML and PDF reports.

## Overview

`form-to-report-engine` keeps report definitions, submitted data, branding, normalization, and rendering separate. A report passes through the existing validation and normalization pipeline before Handlebars produces HTML; Puppeteer can then convert that same HTML into a PDF.

The repository includes property handover and field service examples.

## Prerequisites

- Node.js 22.12 or newer
- npm

## Installation

```sh
git clone <repository-url>
cd form-to-report-engine
npm install
```

Installing dependencies also downloads the Chromium build used by Puppeteer.

## Run the Project

Run the full test suite:

```sh
npm test
```

Generate HTML for the `empty`, `basic`, and `full` submissions of both example reports:

```sh
npm run render:examples
```

Generate PDFs for the `full` submission of both example reports:

```sh
npm run render:pdf-examples
```

Generated files are written to the ignored `output/` directory.

## Core Inputs

- **Schema:** Defines the report title, sections, fields, labels, validation requirements, formatting, and visibility rules.
- **Submission:** Contains the form values for one report instance. Its keys correspond to section and field IDs in the schema.
- **Brand:** Supplies optional presentation values such as company name, tagline, contact details, and primary color.

See `examples/property-handover/` and `examples/field-service/` for complete input sets.

## Supported Section Types

- `fields`: A labeled group of individual values.
- `repeatable`: An array of similarly structured items rendered as cards.
- `table`: An array of rows rendered against defined columns.
- `notes`: A free-text section.
- `signature`: A group of configured signers and their signing status.

## Conditional Sections

A section can use `visibleWhen` to compare a submission value by its dot-separated field path:

```json
{
  "id": "notes",
  "title": "Additional Notes",
  "type": "notes",
  "visibleWhen": {
    "field": "job.status",
    "equals": "Completed"
  }
}
```

Use either `equals` or `notEquals`. A conditional section renders only when its condition matches and the section contains meaningful data.

## Public API Usage

This CommonJS example can be run from the repository root and uses the package entry point:

```js
const fs = require('fs')

const {
  renderReport
} = require('.')

const schema = require('./examples/property-handover/schema.json')
const submission = require('./examples/property-handover/full.json')
const brand = require('./examples/property-handover/brand.json')

async function main() {
  const html = await renderReport(schema, submission, brand, {
    format: 'html'
  })

  fs.mkdirSync('output', { recursive: true })
  fs.writeFileSync('output/property-handover-full.html', html)

  await renderReport(schema, submission, brand, {
    format: 'pdf',
    outputPath: 'output/property-handover-full.pdf'
  })
}

main().catch(console.error)
```

PDF mode accepts the same options as `renderPdf`, including `outputPath`, `launchOptions`, `contentOptions`, `pdfOptions`, and a reusable Puppeteer `browser`.

## Lower-Level API

The package also exports `buildReport`, `normalizeReport`, `validateSchema`, `validateSubmission`, `renderHtml`, and `renderPdf` for applications that need individual pipeline stages.

## Project Structure

```text
src/core/          Validation, conditions, formatting, and normalization
src/renderers/     HTML, PDF, and convenience renderers
src/templates/     Handlebars templates and report CSS
examples/          Independent schemas, submissions, and branding
scripts/           HTML and PDF example generators
tests/             Focused test suite
output/            Generated reports (ignored by Git)
```

## Project Status

Early development. Schema validation, submission validation, normalization, HTML rendering, PDF rendering, and the public convenience API are implemented.

## License

MIT License.
