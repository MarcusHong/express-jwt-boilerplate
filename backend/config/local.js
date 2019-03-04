'use strict'

module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'marcus',
    database: 'example',
    port: '3306',
    connectionLimit: '10',
    timezone: 'utc',
    debug: ['RowDataPacket']
  },
  redis: {
    host: 'localhost',
    port: 6379
  }
}


