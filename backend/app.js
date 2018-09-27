const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const log4js = require('log4js')
log4js.configure({
  appenders: {
    console: {type: 'console'},
    // file: {type: 'file', filename: 'cheese.log'}
  },
  categories: {
    express: {appenders: ['console'], level: 'info'},
    default: {appenders: ['console'], level: 'info'}
  }
})

const routes = require('./routes/index')
const app = express()

app.use(log4js.connectLogger(log4js.getLogger('express'), {level: 'auto', format: ':method :url'}))
// app.use(cors())
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({ extended: false }))
app.use(helmet())

routes(app)

module.exports = app