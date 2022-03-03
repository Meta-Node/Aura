/*eslint-disable*/
const fs = require('fs')
const config = require('../config')
const foldersName = require('../foldersName')

function fontsStyle(cb) {
  const path = './styles/helpers/fonts-include.scss'
  const path2 = foldersName.sourceFolder + '/fonts-include.js'

  fs.writeFile(path, '', cb)
  fs.writeFile(path2, 'export const fi = [', cb)
  return fs.readdir(config.build.fonts, function (err, items) {
    if (items) {
      let cFontname
      for (let i = 0; i < items.length; i++) {
        let fontname = items[i].split('.')[0]
        // fontname = fontname[0]
        if (cFontname !== fontname) {
          fs.appendFile(
            path,
            '@include font("' +
              fontname +
              '", "' +
              fontname +
              '", "400", "normal");\r\n',
            cb
          )
          fs.appendFile(
            path2,
            `
  {
    rel: 'preload',
    type: 'font/woff2',
    href: '/fonts/${fontname}.woff2',
    crossorigin: 'anonymous',
    as: 'font',
  },\r\n`,
            cb
          )
        }
        cFontname = fontname
      }
      fs.appendFile(path2, ']\r\n', cb)
    }
  })
  cb()
}

module.exports = fontsStyle
