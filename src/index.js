const {
  buildReport
} = require('./core/build-report')

const {
  normalizeReport
} = require('./core/normalize-report')

const {
  validateSchema
} = require('./core/validate-schema')

const {
  validateSubmission
} = require('./core/validate-submission')

const {
  renderHtml
} = require('./renderers/render-html')

module.exports = {
  buildReport,
  normalizeReport,
  validateSchema,
  validateSubmission,
  renderHtml
}