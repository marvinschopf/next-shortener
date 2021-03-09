const withPreact = require('next-plugin-preact')
const { i18n } = require('./next-i18next.config')

module.exports = withPreact({
  i18n
})