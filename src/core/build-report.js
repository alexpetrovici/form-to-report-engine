const {
  validateSubmission
} = require('./validate-submission')

const {
  normalizeReport
} = require('./normalize-report')

function buildReport(
  schema = {},
  submission = {},
  brand = {},
  options = {}
) {
  const {
    validateSubmission: shouldValidateSubmission = true
  } = options

  if (shouldValidateSubmission) {
    const validation = validateSubmission(schema, submission)

    if (!validation.valid) {
      throw new Error(
        `Invalid report submission:\n${validation.errors.join('\n')}`
      )
    }
  }

  return normalizeReport(
    schema,
    submission,
    brand
  )
}

module.exports = {
  buildReport
}