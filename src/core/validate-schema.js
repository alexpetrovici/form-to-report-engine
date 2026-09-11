const SUPPORTED_SECTION_TYPES = new Set([
  'fields',
  'repeatable',
  'table',
  'notes',
  'signature'
])

function validateSchema(schema = {}) {
  const errors = []

  if (!schema.id || typeof schema.id !== 'string') {
    errors.push('Schema must define a string "id".')
  }

  if (!schema.title || typeof schema.title !== 'string') {
    errors.push('Schema must define a string "title".')
  }

  if (!Array.isArray(schema.sections)) {
    errors.push('Schema must define a "sections" array.')
    return {
      valid: errors.length === 0,
      errors
    }
  }

  schema.sections.forEach((section, index) => {
    validateSection(section, index, errors)
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

function validateSection(section = {}, index, errors) {
  const location = `sections[${index}]`

  if (!section.id || typeof section.id !== 'string') {
    errors.push(`${location} must define a string "id".`)
  }

  if (!section.title || typeof section.title !== 'string') {
    errors.push(`${location} must define a string "title".`)
  }

  if (!SUPPORTED_SECTION_TYPES.has(section.type)) {
    errors.push(
      `${location} has unsupported type "${section.type}".`
    )
    return
  }

  switch (section.type) {
    case 'fields':
    case 'repeatable':
      if (!Array.isArray(section.fields)) {
        errors.push(
          `${location} must define a "fields" array.`
        )
      }
      break

    case 'table':
      if (!Array.isArray(section.columns)) {
        errors.push(
          `${location} must define a "columns" array.`
        )
      }
      break

    case 'signature':
      if (!Array.isArray(section.signers)) {
        errors.push(
          `${location} must define a "signers" array.`
        )
      }
      break

    default:
      break
  }
}

module.exports = {
  validateSchema
}