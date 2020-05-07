'use strict'
module.exports = {
  // NODE_ENV: '"production"'
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  IS_BUILD: JSON.stringify(process.env.IS_BUILD)
}
