const assert = require('assert')

const {
  renderHtml
} = require('../src/renderers/render-html')

const report = {
  title: 'Example Report',
  sections: [
    {
      id: 'details',
      title: 'Details',
      type: 'fields',
      visible: true,
      fields: [
        {
          id: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          value: 'Example User',
          displayValue: 'Example User'
        }
      ]
    },
    {
      id: 'hidden',
      title: 'Hidden Section',
      type: 'notes',
      visible: false,
      value: 'This should not appear'
    }
  ]
}

const html = renderHtml(report)

assert(
  html.includes('Example Report'),
  'Report title should be rendered'
)

assert(
  html.includes('Example User'),
  'Field value should be rendered'
)

assert(
  !html.includes('Hidden Section'),
  'Hidden sections should not be rendered'
)

assert(
  !html.includes('This should not appear'),
  'Hidden section content should not be rendered'
)

console.log('render-html tests passed.')