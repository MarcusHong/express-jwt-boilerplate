'use strict'

const Schemas = require('../schemas/index')

async function verifyOptions(req, paths, schema) {
  const options = Object.assign({}, req.params, req.query, req.body, req.file)
  try {
    if (paths) {
      paths.forEach(path => Schemas.convert(options, path))
    }
    if (schema) Schemas.convert(options, schema, {coerceTypes: 'array'})
  }
  catch (err) {
    throw {status: 400, message: err}
  }
  return options
}

module.exports = (paths, schema) => {
  return async (req, res, next) => {
    try {
      req.options = await verifyOptions(req, paths, schema)
      next()
    }
    catch (err) {
      next(err)
    }
  }
}