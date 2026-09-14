# form-to-report-engine

Open-source schema-driven engine for turning structured form data into modular, professional HTML and PDF reports.

## Overview

`form-to-report-engine` is a JavaScript-based reporting engine designed to transform structured form submissions into reusable, configurable reports.

The project focuses on separating:

* form data
* report schemas
* normalization logic
* presentation components
* branding
* PDF rendering

This makes it possible to build different report types without hardcoding an entire document for every use case.

Example applications include:

* property handover reports
* field service reports
* inspection reports
* maintenance reports
* damage documentation
* installation reports
* vehicle condition reports
* structured checklists

## Core Concept

```text
Report Schema
     +
Form Submission
     +
Brand Configuration
        ↓
Data Normalization
        ↓
Normalized Report Model
        ↓
Reusable Report Components
        ↓
HTML / Handlebars
        ↓
Chrome PDF
        ↓
Professional Report
```

## Goals

The project aims to provide:

* schema-driven report definitions
* reusable report components
* conditional sections
* repeatable data groups
* dynamic tables and rows
* configurable branding
* HTML report rendering
* PDF generation
* multi-page document support
* reusable headers and footers
* clean separation between data and presentation

## Planned Example Reports

The engine will initially be demonstrated with two independent example workflows.

### Property Handover Report

A structured handover and inspection report containing:

* property details
* room inspections
* condition ratings
* defects
* meter readings
* keys
* notes
* photos
* signatures

### Field Service Report

A structured service report containing:

* customer information
* job details
* work performed
* measurements
* materials
* identified issues
* recommendations
* photos
* customer and technician signatures

## Planned Architecture

```text
form-to-report-engine/
├── docs/
│   ├── architecture.md
│   └── schema.md
├── examples/
│   ├── property-handover/
│   └── field-service/
├── src/
│   ├── core/
│   ├── renderers/
│   ├── components/
│   └── shared/
├── screenshots/
├── README.md
├── LICENSE
└── .gitignore
```

## Technology Direction

The project is expected to use:

* JavaScript
* Node.js
* Handlebars
* HTML
* CSS
* Puppeteer
* Chromium PDF

Additional technologies may be introduced as the engine evolves.

## Usage

Build and render a report through the package API:

```js
const { renderReport } = require('form-to-report-engine')

async function main() {
  const html = await renderReport(schema, submission, brand, {
    format: 'html'
  })

  const pdf = await renderReport(schema, submission, brand, {
    format: 'pdf',
    outputPath: 'output/report.pdf'
  })
}

main().catch(console.error)
```

The lower-level `buildReport`, `normalizeReport`, `renderHtml`, and `renderPdf`
functions remain available when individual pipeline stages are needed.

Generate the HTML examples or the two full PDF examples locally:

```sh
npm run render:examples
npm run render:pdf-examples
```

## Project Status

Early development. The project includes schema validation, normalization, HTML rendering, and initial Chromium-based PDF rendering.

## License

MIT License.
