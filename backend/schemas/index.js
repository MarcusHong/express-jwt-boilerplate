'use strict'

const Ajv = require('ajv')
const fs = require('fs')
const path = require('path')
const defaultAjv = new Ajv({useDefaults: true, removeAdditional: true, coerceTypes: 'array'})

function assignAllJson(dir, all) {
  fs.readdirSync(dir)
    .forEach((target) => {
      const targetDir = path.join(dir, target)
      if (fs.statSync(targetDir).isDirectory()) {
        assignAllJson(targetDir, all)
      }
      else if (target.endsWith('.json')) {
        const key = target.replace('.json', '')
        all[key] = require(targetDir)
      }
    })
  return all
}

function convert(data, schema, options) {
  if (!schema) throw 'schema is undefined'
  const components = Object.assign({}, this.entry)
  delete components[schema]

  const ajvObject = Object.assign({}, this.entry[schema])
  ajvObject.components = {schemas: components}

  let ajv
  if (options) ajv = new Ajv(options)
  else ajv = defaultAjv

  const validate = ajv.compile(ajvObject)
  if (!validate(data)) {
    ajv.validate(ajvObject, data)
    throw ajv.errorsText()
  }
}

module.exports = {
  entry: assignAllJson(__dirname, {}),
  convert
}
