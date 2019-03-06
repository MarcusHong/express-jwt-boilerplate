'use strict'

const db = require('../components/db')
const crypto = require('crypto')

module.exports.tableName = 'Users'

function generateRandomHash(length) {
  return crypto.randomBytes(length).toString('base64').replace(/[^A-Za-z0-9]/g, '')
}

function createPasswordHash(password) {
  return new Promise((resolve, reject) => {
    const salt = generateRandomHash(64)
    crypto.pbkdf2(password, salt, 108236, 64, 'sha512', (err, key) => {
      if (err) reject(err)
      resolve({password: key.toString('base64'), salt})
    })
  })
}

module.exports.verifyPassword = (password, hash, salt) => {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 108236, 64, 'sha512', (err, key) => {
      if (err) reject(err)
      if (key.toString('base64') === hash) resolve(true)
      else resolve(false)
    })
  })
}

module.exports.createUser = async (options, connection) => {
  try {
    const refreshHash = generateRandomHash(64)
    const passwordHash = await createPasswordHash(options.password)
    const {insertId} = await db.query({
      connection: connection,
      sql: `INSERT INTO ?? SET ?`,
      values: [this.tableName, {
        email: options.email, password: passwordHash.password, salt: passwordHash.salt, refresh: refreshHash
      }]
    })

    options.user_id = insertId
    delete options.password
    return {user: options, refreshHash}
  }
  catch (err) {
    throw err
  }
}

module.exports.updatePassword = async ({password, id}) => {
  try {
    const refreshHash = generateRandomHash(64)
    const passwordHash = await createPasswordHash(password)
    await db.query({
      sql: `UPDATE ?? SET ? WHERE ?`,
      values: [this.tableName, {
        password: passwordHash.password,
        salt: passwordHash.salt,
        refresh: refreshHash
      }, {id}]
    })
    return refreshHash
  }
  catch (err) {
    throw err
  }
}

module.exports.findOne = async (options) => {
  try {
    const result = await db.query({
      sql: `SELECT * FROM ?? WHERE ? LIMIT 1`,
      values: [this.tableName, options]
    })
    return result[0]
  }
  catch (err) {
    throw err
  }
}
