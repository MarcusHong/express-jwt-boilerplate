'use strict'

const fs = require('fs')
const path = require('path')
const ApiRouter = require('../../controllers/default').ApiRouter
const schemas = require('../../schemas').entry
const pkg = require('../../../package')
const _ = require('lodash')

function generatePath(path, obj, swaggerPaths) {
  Object.keys(obj).forEach(key => {
    const ctrl = obj[key]
    if (ctrl instanceof ApiRouter) {
      let url
      if (typeof ctrl.name === 'string') {
        if (ctrl.name.length > 0) {
          const sub = ctrl.name.split('/').map(str => {
            if (str.indexOf(':') === 0) {
              str = str.replace(':', '')
              return `{${str}}`
            }
            return str
          }).join('/')
          url = `${path}/${sub}`
        }
        else {
          url = path
        }
      }
      else {
        url = `${path}/${key}`
      }
      if (ctrl.method) {
        if (!swaggerPaths.hasOwnProperty(url)) {
          swaggerPaths[url] = {}
        }
        const path = {
          tags: ctrl.tags,
          summary: ctrl.summary,
          description: ctrl.description,
          parameters: [...ctrl.parameters],
          responses: ctrl.responses
        }
        if (ctrl.paths) {
          ctrl.paths.forEach(aPath => {
            const schema = schemas[aPath]
            _.forEach(schema.properties, (value, key) => {
              path.parameters.push({
                in: 'path',
                name: key,
                required: true,
                schema: schema.properties[key]
              })
            })
          })
        }
        if (ctrl.schema) {
          if (['post', 'put'].includes(ctrl.method)) {
            const contentType = ctrl.contentType ? ctrl.contentType : 'application/json'
            path.requestBody = {content: {}}
            path.requestBody.content[contentType] = {schema: {$ref: `#/components/schemas/${ctrl.schema}`}}
          }
          else {
            const schema = schemas[ctrl.schema]
            if (schema && schema.properties) {
              _.forEach(schema.properties, (value, key) => {
                let required = schema.required.indexOf(key) > -1
                path.parameters.push({
                  in: 'query',
                  name: key,
                  required,
                  schema: schema.properties[key]
                })
              })
            }
          }
        }
        if (!ctrl.isPublic) {
          path.security = [{'bearerAuth': []}]
        }
        swaggerPaths[url][ctrl.method] = path
      }
    }
  })
}

function loadRoutes(dir, currentDir, swaggerPaths) {
  fs.readdirSync(dir)
      .forEach(target => {
        const targetDir = path.join(dir, target)
        const routePath = '/' + path.relative(currentDir, targetDir).replace('/index.js', '')

        if (fs.lstatSync(targetDir).isDirectory()) {
          loadRoutes(targetDir, currentDir, swaggerPaths)
        }
        else if (target === 'index.js') {
          const requirePath = path.relative(__dirname, targetDir)
          const middleware = require(`./${requirePath}`)
          generatePath(routePath, middleware, swaggerPaths)
        }
      })
  return swaggerPaths
}

const securitySchemes = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  }
}

const swagger = {
  openapi: '3.0.0',
  info: {
    title: `${pkg.name} ${process.env.NODE_ENV}`,
    description: `API Document for ${pkg.name} ${process.env.NODE_ENV}`,
    contact: {
      name: 'Marcus'
    },
    version: '0.1.0'
  },
  components: {
    schemas, securitySchemes
  },
}

// if (process.env.NODE_ENV === 'development')
//   swagger.servers = [{url: `http://mucollabo-dev.hz3kihwd2v.ap-northeast-2.elasticbeanstalk.com`}]
// else swagger.servers = [{url: '/'}]
swagger.servers = [{url: '/'}]

module.exports = () => {
  try {
    swagger.paths = loadRoutes(path.join(__dirname, '../../controllers'), path.join(__dirname, '../../controllers'), {})
    return swagger
  }
  catch (err) {
    throw err
  }
}