'use strict'

const mysql = require('mysql')
const config = require('../config')
const Schemas = require('../schemas/index')
const Code = require('../libs/code')

const pool = mysql.createPool({
  ...config.database,
  typeCast: function (field, next) {
    if ((field.type === 'TINY' || field.type === 'TINYINT') && field.length === 1) {
      return (field.string() === '1')
    } else if (field.type === 'JSON') {
      const json = JSON.parse(field.string())
      if (Array.isArray(json)) return json.filter(i => i)
      return json
    }
    return next()
  }
})

module.exports.query = (options) => {
  return new Promise((resolve, reject) => {
    try {
      let target = options.connection ? options.connection : pool
      let sql = mysql.format(options.sql, options.values)
      console.log(sql + '\n')
      target.query({sql: sql, nestTables: options.nestTables},
        (error, results, fields) => {
          if (error) {
            reject(error)
          } else {
            if (options.schema) {
              results.forEach(row => {
                Schemas.convert(row, options.schema, {useDefaults: true, removeAdditional: true})
              })
            }
            resolve(results)
          }
        })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports.getConnection = () => {
  return new Promise((resolve, reject) => {
    try {
      pool.getConnection((err, connection) => {
        if (err) reject(err)
        else {
          resolve(connection)
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}


module.exports.beginTransaction = () => {
  return new Promise((resolve, reject) => {
    try {
      this.getConnection()
        .then(connection => {
          connection.beginTransaction(err => {
            if (err) reject(this.rollback(connection))
            else resolve(connection)
          })
        })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports.commit = (connection) => {
  return new Promise((resolve, reject) => {
    try {
      connection.commit(err => {
        if (err) reject(this.rollback(connection))
        else {
          connection.release()
          resolve()
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports.rollback = (connection) => {
  return new Promise((resolve, reject) => {
    try {
      connection.rollback(err => {
        if (err) reject(err)
        else {
          connection.release()
          resolve()
        }
      })
    } catch (e) {
      reject(e)
    }
  })
}

module.exports.reduceNull = (rows, property, key, keyToInt) => {
  try {
    return rows.map(row => {
      if (!Array.isArray(row[property])) {
        row[property] = Object.keys(row[property]).reduce((prev, curr) => {
          if (curr !== 'null') {
            const newItem = row[property][curr]
            newItem[key] = keyToInt ? parseInt(curr) : curr
            prev.push(newItem)
          }
          return prev
        }, [])
      }
      row[property] = row[property].reduce((prev, curr) => {
        if (curr[key]) prev.push(curr)
        return prev
      }, [])
      return row
    })
  } catch (e) {
    return rows
  }
}
