'use strict'

const serializeError = require('serialize-error')
const createError = require('http-errors')

function errorHandler(err, req, res, next) {
  if (err && req.app.get('env') === 'production') {
    delete err.stack
  } else {
    console.log(err)
  }
  const status = err.status || 500
  delete err.status
  res.status(status).json(serializeError(err) || {}).end()
}

module.exports = (app) => {
  app.use(function (req, res, next) {
    next(createError(404))
  })
  app.use(errorHandler)
}
