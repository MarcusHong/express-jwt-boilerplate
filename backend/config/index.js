'use strict'

if (['production', 'development', 'local', 'test'].indexOf(process.env.NODE_ENV) === -1) {
  process.env.NODE_ENV = 'local'
}
const envs = require(`./${process.env.NODE_ENV}`)

Object.assign(process.env, envs)

module.exports = envs
