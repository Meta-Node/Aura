const util = require('gulp-util')
const foldersName = require('./foldersName')

const projectFolder = foldersName.projectFolder
const sourceFolder = foldersName.sourceFolder

const production = util.env.production || util.env.prod || false

const config = {
  env: 'development',
  production,
  build: {
    img: projectFolder + '/img/',
    fonts: projectFolder + '/fonts/',
  },
  src: {
    img: sourceFolder + '/img/**/*.{jpg,png,svg,gif,ico,webp}',
    fonts: sourceFolder + '/fonts/*.ttf',
  },

  setEnv(env) {
    if (typeof env !== 'string') return
    this.env = env
    this.production = env === 'production'
    process.env.NODE_ENV = env
  },

  logEnv() {
    util.log(
      'Environment:',
      util.colors.white.bgMagenta(' ' + process.env.NODE_ENV + ' ')
    )
  },
}

config.setEnv(production ? 'production' : 'development')

module.exports = config
