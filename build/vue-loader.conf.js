'use strict'
const utils = require('./utils')
const config = require('../config')
const isProduction = process.env.IS_BUILD === 'true'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap
const extractEnabled = isProduction
  ? config.build.cssExtract
  : config.dev.cssExtract

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: extractEnabled
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
