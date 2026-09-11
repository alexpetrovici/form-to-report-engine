function formatValue(value, type = 'text') {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  switch (type) {
    case 'date':
      return formatDate(value)

    case 'boolean':
      return value ? 'Yes' : 'No'

    default:
      return String(value)
  }
}

function formatDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

module.exports = {
  formatValue,
  formatDate
}