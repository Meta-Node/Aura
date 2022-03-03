const { src, dest } = require('gulp')
const ttf2woff2 = require('gulp-ttf2woff2')
const config = require('../config')

function fonts() {
  return src(config.src.fonts).pipe(ttf2woff2()).pipe(dest(config.build.fonts))
}

module.exports = fonts
