'use strict'

const ApiRouter = require('../default').ApiRouter
const ctrl = require('./users-ctrl')

module.exports.getUser = new ApiRouter({
  name: '',
  method: 'get',
  summary: 'Get user info',
  tags: ['Users'],
  isPublic: false,
  responses: {
    200: {description: 'Success'},
    404: {description: 'Not found'}
  },
  handler: ctrl.getUser
})
