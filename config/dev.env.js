'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  IS_BUILD: JSON.stringify(process.env.IS_BUILD)
});
