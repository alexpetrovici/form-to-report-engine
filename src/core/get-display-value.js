function getDisplayValue(value, fallback = '—') {
  if (value === undefined || value === null || value === '') {
    return fallback
  }

  return String(value)
}

module.exports = {
  getDisplayValue
}