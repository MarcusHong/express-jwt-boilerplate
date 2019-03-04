'use strict'

module.exports = {
  database: {
    host: '{host}',
    user: '{user name}',
    password: '{password}',
    database: '{database name}',
    port: '3306',
    connectionLimit: '10',
    timezone: 'utc',
    debug: ['RowDataPacket']
  },
  redis: {
    host: '{redis host}',
    port: 6379
  }
}
