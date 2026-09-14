const SUPPORTED_SECTION_TYPES = new Set([
  'fields',
  'repeatable',
  'table',
  'notes',
  'signature',
  'images'
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

  validateOptionalBoolean(
    section.pageBreakBefore,
    `${location}.pageBreakBefore`,
    errors
  )

  validateOptionalBoolean(
    section.keepTogether,
    `${location}.keepTogether`,
    errors
  )

  validateVisibleWhen(
  section.visibleWhen,
  location,
  errors
  )

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

function validateOptionalBoolean(value, location, errors) {
  if (value !== undefined && typeof value !== 'boolean') {
    errors.push(`${location} must be a boolean.`)
  }
}

function validateVisibleWhen(condition, location, errors) {
  if (condition === undefined) {
    return
  }

  if (!condition || typeof condition !== 'object' || Array.isArray(condition)) {
    errors.push(`${location}.visibleWhen must be an object.`)
    return
  }

  if (!condition.field || typeof condition.field !== 'string') {
    errors.push(
      `${location}.visibleWhen must define a string "field".`
    )
  }

  const hasEquals = Object.prototype.hasOwnProperty.call(
    condition,
    'equals'
  )

  const hasNotEquals = Object.prototype.hasOwnProperty.call(
    condition,
    'notEquals'
  )

  if (!hasEquals && !hasNotEquals) {
    errors.push(
      `${location}.visibleWhen must define either "equals" or "notEquals".`
    )
  }

  if (hasEquals && hasNotEquals) {
    errors.push(
      `${location}.visibleWhen cannot define both "equals" and "notEquals".`
    )
  }
}

module.exports = {
  validateSchema
}
