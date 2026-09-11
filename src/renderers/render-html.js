const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const templatesDirectory = path.resolve(
  __dirname,
  '..',
  'templates'
)

const styles = fs.readFileSync(
  path.join(templatesDirectory, 'report.css'),
  'utf-8'
)

/**
 * Loads and compiles a Handlebars template.
 */
function loadTemplate(relativePath) {
  const templatePath = path.join(
    templatesDirectory,
    relativePath
  )

  const source = fs.readFileSync(
    templatePath,
    'utf-8'
  )

  return Handlebars.compile(source)
}

/**
 * Adds one to a zero-based index.
 *
 * Used by repeatable sections so the first row is displayed as "Item 1"
 * instead of "Item 0".
 */
Handlebars.registerHelper('addOne', (value) => {
  return Number(value) + 1
})

const reportTemplate = loadTemplate('report.hbs')

const sectionTemplates = {
  fields: loadTemplate('sections/fields.hbs'),
  repeatable: loadTemplate('sections/repeatable.hbs'),
  table: loadTemplate('sections/table.hbs'),
  notes: loadTemplate('sections/notes.hbs'),
  signature: loadTemplate('sections/signature.hbs')
}

/**
 * Renders one normalized report section.
 */
function renderSection(section = {}) {
  if (!section.visible) {
    return ''
  }

  const template = sectionTemplates[section.type]

  if (!template) {
    return ''
  }

  return template(section)
}

/**
 * Renders a normalized report model into HTML.
 */
function renderHtml(report = {}) {
  const sections = Array.isArray(report.sections)
    ? report.sections
    : []

  const renderedSections = sections
    .map((section) => renderSection(section))
    .join('\n')

  return reportTemplate({
    ...report,
    styles: new Handlebars.SafeString(styles),
    renderedSections: new Handlebars.SafeString(
      renderedSections
    )
  })
}

module.exports = {
  renderHtml,
  renderSection
}