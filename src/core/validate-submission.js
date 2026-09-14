function validateSubmission(schema = {}, submission = {}) {
  const errors = []

  if (!submission || typeof submission !== 'object' || Array.isArray(submission)) {
    return {
      valid: false,
      errors: ['Submission must be an object.']
    }
  }

  const sections = Array.isArray(schema.sections)
    ? schema.sections
    : []

  sections.forEach((section) => {
    validateSectionSubmission(section, submission[section.id], errors)
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

function validateSectionSubmission(section, value, errors) {
  switch (section.type) {
    case 'fields':
      validateFields(section, value, errors)
      break

    case 'repeatable':
      validateRepeatable(section, value, errors)
      break

    case 'table':
      validateTable(section, value, errors)
      break

    case 'notes':
      validateNotes(section, value, errors)
      break

    case 'signature':
      validateSignature(section, value, errors)
      break

    case 'images':
      validateImages(section, value, errors)
      break

    default:
      break
  }
}

function validateFields(section, value, errors) {
  if (value === undefined) {
    value = {}
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`Section "${section.id}" must be an object.`)
    return
  }

  const fields = Array.isArray(section.fields)
    ? section.fields
    : []

  fields.forEach((field) => {
    if (!field.required) {
      return
    }

    if (!hasValue(value[field.id])) {
      errors.push(
        `Required field "${section.id}.${field.id}" is missing.`
      )
    }
  })
}

function validateRepeatable(section, value, errors) {
  if (value === undefined) {
    return
  }

  if (!Array.isArray(value)) {
    errors.push(`Section "${section.id}" must be an array.`)
    return
  }

  value.forEach((row, index) => {
    if (!row || typeof row !== 'object' || Array.isArray(row)) {
      errors.push(
        `Section "${section.id}" row ${index} must be an object.`
      )
      return
    }

    const fields = Array.isArray(section.fields)
      ? section.fields
      : []

    fields.forEach((field) => {
      if (!field.required) {
        return
      }

      if (!hasValue(row[field.id])) {
        errors.push(
          `Required field "${section.id}[${index}].${field.id}" is missing.`
        )
      }
    })
  })
}

function validateTable(section, value, errors) {
  if (value === undefined) {
    return
  }

  if (!Array.isArray(value)) {
    errors.push(`Section "${section.id}" must be an array.`)
  }
}

function validateNotes(section, value, errors) {
  if (value === undefined) {
    return
  }

  if (typeof value !== 'string') {
    errors.push(`Section "${section.id}" must be a string.`)
  }
}

function validateSignature(section, value, errors) {
  if (value === undefined) {
    return
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    errors.push(`Section "${section.id}" must be an object.`)
  }
}

function validateImages(section, value, errors) {
  if (value === undefined) {
    return
  }

  if (!Array.isArray(value)) {
    errors.push(`Section "${section.id}" must be an array.`)
    return
  }

  value.forEach((image, index) => {
    if (!image || typeof image !== 'object' || Array.isArray(image)) {
      errors.push(
        `Section "${section.id}" image ${index} must be an object.`
      )
      return
    }

    if (typeof image.src !== 'string' || image.src.trim() === '') {
      errors.push(
        `Image "${section.id}[${index}].src" must be a non-empty string.`
      )
    }
  })
}

function hasValue(value) {
  if (typeof value === 'string') {
    return value.trim() !== ''
  }

  return value !== undefined && value !== null
}

module.exports = {
  validateSubmission
}
