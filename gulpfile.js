const images = require('./gulp/tasks/images')
const fonts = require('./gulp/tasks/fonts')

const fontsInclude = require('./gulp/tasks/fontsInclude')

// function clean() {
//   return del(config.clean)
// }

exports.fonts = fonts
exports.images = images
exports.fi = fontsInclude
// exports.clean = clean
