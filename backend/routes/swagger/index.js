'use strict'

const express = require('express')
const router = express.Router()
const generator = require('./generator')

const swaggerFile = 'doc.json'
const doc = generator()

if (process.env.NODE_ENV !== 'production') {
  router.use('/', (req, res, next) => {
    if (req.url === '/') {
      return res.redirect(`?url=${swaggerFile}`)
    }
    next()
  }, express.static(`${__dirname}/../../../node_modules/swagger-ui-dist`))

  router.route('/' + swaggerFile).get((req, res, next) => {
    try {
      res.status(200).json(doc)
    }
    catch (err) {
      next(err)
    }
  })
}

module.exports = router
