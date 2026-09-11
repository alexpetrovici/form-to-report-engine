const {
  getDisplayValue
} = require('./get-display-value')

const {
  formatValue
} = require('./format-value')

const {
  evaluateCondition
} = require('./evaluate-condition')

const {
  validateSchema
} = require('./validate-schema')

/**
 * Builds a normalized report model from a report schema and submission data.
 *
 * The goal of this layer is to keep rendering logic simple by giving
 * templates a predictable structure regardless of the original form shape.
 */

function normalizeReport(schema = {}, submission = {}, brand = {}) {
  const validation = validateSchema(schema)

  if (!validation.valid) {
    throw new Error(
      `Invalid report schema:\n${validation.errors.join('\n')}`
    )
  }

  const sections = schema.sections

  return {
    id: schema.id || '',
    version: schema.version || '',
    title: schema.title || 'Untitled Report',
    brand: normalizeBrand(brand),

    sections: sections.map((section) =>
      normalizeSection(section, submission)
    )
  }
}

/**
 * Normalizes one schema section based on its declared type.
 */
function normalizeSection(section = {}, submission = {}) {
  const sectionData = submission[section.id]

  const normalizedSection = {
    id: section.id || '',
    title: section.title || '',
    type: section.type || 'unknown',
    visible:
        evaluateCondition(section.visibleWhen, submission) &&
        hasMeaningfulData(section.type, sectionData)
  }

  switch (section.type) {
    case 'fields':
      return {
        ...normalizedSection,
        fields: normalizeFields(section.fields, sectionData)
      }

    case 'repeatable':
      return {
        ...normalizedSection,
        rows: normalizeRepeatableRows(section.fields, sectionData)
      }

    case 'table':
      return {
        ...normalizedSection,
        columns: normalizeColumns(section.columns),
        rows: normalizeTableRows(section.columns, sectionData)
      }

    case 'notes':
      return {
        ...normalizedSection,
        value: normalizeText(sectionData)
      }

    case 'signature':
      return {
        ...normalizedSection,
        signers: normalizeSigners(section.signers, sectionData)
      }

    default:
      return {
        ...normalizedSection,
        data: sectionData ?? null
      }
  }
}

/**
 * Normalizes a standard fields section.
 */
function normalizeFields(fields = [], sectionData = {}) {
  if (!Array.isArray(fields)) {
    return []
  }

  const data =
    sectionData && typeof sectionData === 'object'
      ? sectionData
      : {}

  return fields.map((field) => ({
    id: field.id || '',
    label: field.label || '',
    type: field.type || 'text',
    required: field.required === true,
    value: normalizeValue(data[field.id]),
    displayValue: getDisplayValue(
      formatValue(
        data[field.id],
        field.type
      )
    )
  }))
}

/**
 * Normalizes repeated object rows.
 */
function normalizeRepeatableRows(fields = [], sectionData = []) {
  if (!Array.isArray(sectionData)) {
    return []
  }

  return sectionData
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      fields: normalizeFields(fields, row)
    }))
}

/**
 * Normalizes table column definitions.
 */
function normalizeColumns(columns = []) {
  if (!Array.isArray(columns)) {
    return []
  }

  return columns.map((column) => ({
    id: column.id || '',
    label: column.label || '',
    type: column.type || 'text'
  }))
}

/**
 * Normalizes table rows while keeping them aligned with the schema columns.
 */
function normalizeTableRows(columns = [], sectionData = []) {
  if (!Array.isArray(sectionData)) {
    return []
  }

  const normalizedColumns = normalizeColumns(columns)

  return sectionData
    .filter((row) => row && typeof row === 'object')
    .map((row) => ({
      cells: normalizedColumns.map((column) => ({
        id: column.id,
        value: normalizeValue(row[column.id]),
        displayValue: getDisplayValue(
          formatValue(
            row[column.id],
            column.type
          )
        )
      }))
    }))
}

/**
 * Normalizes signature data against the schema-defined signer list.
 */
function normalizeSigners(signers = [], sectionData = {}) {
  if (!Array.isArray(signers)) {
    return []
  }

  const data =
    sectionData && typeof sectionData === 'object'
      ? sectionData
      : {}

  return signers.map((signer) => {
    const signerData =
      data[signer.id] && typeof data[signer.id] === 'object'
        ? data[signer.id]
        : {}

    return {
      id: signer.id || '',
      label: signer.label || '',
      name: normalizeText(signerData.name),
      displayName: getDisplayValue(
        normalizeText(signerData.name)
      ),
      signed: Boolean(signerData.signature)
    }
  })
}

/**
 * Determines whether a section contains data worth rendering.
 */
function hasMeaningfulData(type, value) {
  switch (type) {
    case 'fields':
      return hasObjectValues(value)

    case 'repeatable':
    case 'table':
      return Array.isArray(value) && value.length > 0

    case 'notes':
      return normalizeText(value) !== ''

    case 'signature':
      return hasObjectValues(value)

    default:
      return value !== undefined && value !== null
  }
}

/**
 * Checks whether an object contains at least one meaningful value.
 */
function hasObjectValues(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return false
  }

  return Object.values(value).some((item) => {
    if (typeof item === 'string') {
      return item.trim() !== ''
    }

    if (Array.isArray(item)) {
      return item.length > 0
    }

    if (item && typeof item === 'object') {
      return hasObjectValues(item)
    }

    return item !== undefined && item !== null
  })
}

/**
 * Converts undefined or null values into an empty string while preserving
 * valid primitive values such as numbers and booleans.
 */
function normalizeValue(value) {
  if (value === undefined || value === null) {
    return ''
  }

  return value
}

function normalizeText(value) {
  return typeof value === 'string'
    ? value.trim()
    : ''
}

/**
 * Normalizes optional report branding.
 */
function normalizeBrand(brand = {}) {
  return {
    companyName: normalizeText(brand.companyName),
    tagline: normalizeText(brand.tagline),
    email: normalizeText(brand.email),
    phone: normalizeText(brand.phone),
    website: normalizeText(brand.website),
    primaryColor: normalizeText(brand.primaryColor)
  }
}

module.exports = {
  normalizeReport,
  normalizeSection,
  normalizeFields,
  normalizeRepeatableRows,
  normalizeColumns,
  normalizeTableRows,
  normalizeSigners,
  normalizeBrand,
  hasMeaningfulData
}