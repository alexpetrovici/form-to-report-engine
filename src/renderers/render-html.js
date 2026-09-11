/**
 * Renders a normalized report model into basic HTML.
 *
 * This is the first renderer implementation. It intentionally keeps the
 * markup simple so the rendering pipeline can be tested before introducing
 * Handlebars templates and PDF generation.
 */

function renderHtml(report = {}) {
  const title = escapeHtml(report.title || 'Untitled Report')
  const sections = Array.isArray(report.sections)
    ? report.sections.filter((section) => section.visible)
    : []

  const sectionHtml = sections
    .map((section) => renderSection(section))
    .join('\n')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body>
  <main>
    <h1>${title}</h1>

    ${sectionHtml}
  </main>
</body>
</html>
`.trim()
}

function renderSection(section = {}) {
  switch (section.type) {
    case 'fields':
      return renderFieldsSection(section)

    case 'repeatable':
      return renderRepeatableSection(section)

    case 'table':
      return renderTableSection(section)

    case 'notes':
      return renderNotesSection(section)

    case 'signature':
      return renderSignatureSection(section)

    default:
      return ''
  }
}

function renderFieldsSection(section) {
  const fields = Array.isArray(section.fields)
    ? section.fields
    : []

  const rows = fields
    .map(
      (field) => `
      <div>
        <strong>${escapeHtml(field.label)}</strong>
        <span>${escapeHtml(formatValue(field.value))}</span>
      </div>
    `
    )
    .join('')

  return `
<section>
  <h2>${escapeHtml(section.title)}</h2>
  ${rows}
</section>
`.trim()
}

function renderRepeatableSection(section) {
  const rows = Array.isArray(section.rows)
    ? section.rows
    : []

  const renderedRows = rows
    .map((row, index) => {
      const fields = Array.isArray(row.fields)
        ? row.fields
        : []

      const renderedFields = fields
        .map(
          (field) => `
          <div>
            <strong>${escapeHtml(field.label)}</strong>
            <span>${escapeHtml(formatValue(field.value))}</span>
          </div>
        `
        )
        .join('')

      return `
      <article>
        <h3>Item ${index + 1}</h3>
        ${renderedFields}
      </article>
    `
    })
    .join('')

  return `
<section>
  <h2>${escapeHtml(section.title)}</h2>
  ${renderedRows}
</section>
`.trim()
}

function renderTableSection(section) {
  const columns = Array.isArray(section.columns)
    ? section.columns
    : []

  const rows = Array.isArray(section.rows)
    ? section.rows
    : []

  const headerHtml = columns
    .map((column) => `<th>${escapeHtml(column.label)}</th>`)
    .join('')

  const rowsHtml = rows
    .map((row) => {
      const cells = Array.isArray(row.cells)
        ? row.cells
        : []

      return `
      <tr>
        ${cells
          .map(
            (cell) =>
              `<td>${escapeHtml(formatValue(cell.value))}</td>`
          )
          .join('')}
      </tr>
    `
    })
    .join('')

  return `
<section>
  <h2>${escapeHtml(section.title)}</h2>

  <table>
    <thead>
      <tr>
        ${headerHtml}
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</section>
`.trim()
}

function renderNotesSection(section) {
  return `
<section>
  <h2>${escapeHtml(section.title)}</h2>
  <p>${escapeHtml(formatValue(section.value))}</p>
</section>
`.trim()
}

function renderSignatureSection(section) {
  const signers = Array.isArray(section.signers)
    ? section.signers
    : []

  const signerHtml = signers
    .map(
      (signer) => `
      <div>
        <strong>${escapeHtml(signer.label)}</strong>
        <span>${escapeHtml(signer.name)}</span>
        <span>${signer.signed ? 'Signed' : 'Not signed'}</span>
      </div>
    `
    )
    .join('')

  return `
<section>
  <h2>${escapeHtml(section.title)}</h2>
  ${signerHtml}
</section>
`.trim()
}

function formatValue(value) {
  if (value === undefined || value === null) {
    return ''
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  return String(value)
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

module.exports = {
  renderHtml,
  renderSection
}