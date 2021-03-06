'use strict'

const Schemas = require('../schemas/index')

async function verifyOptions(req, paths, schema, coerceTypes) {
  const options = Object.assign({}, req.query, req.body, req.file)
  try {
    console.log('Request: ' + JSON.stringify(options, null, 2))
    if (paths) {
      paths.forEach(path => Schemas.convert(req.params, path))
    }
    if (schema) Schemas.convert(options, schema, {coerceTypes})
  } catch (err) {
    throw {status: 400, message: err}
  }
  return {...req.params, ...options}
}

module.exports = (paths, schema, coerceTypes) => {
  return async (req, res, next) => {
    try {
      req.options = await verifyOptions(req, paths, schema, coerceTypes)
      next()
    } catch (err) {
      next(err)
    }
  }
}
