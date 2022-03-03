const { src, dest } = require('gulp')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')

const config = require('../config')

function images() {
  return src(config.src.img)
    .pipe(
      webp({
        quality: 86,
      })
    )
    .pipe(dest(config.build.img))
    .pipe(src(config.src.img))
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 88, progressive: true }),
        imagemin.optipng({ optimizationLevel: 1 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(config.build.img))
}

module.exports = images
