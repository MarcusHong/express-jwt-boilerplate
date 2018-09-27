'use strict'

module.exports = {
  database: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'example',
    port: '3306',
    connectionLimit: '10',
    timezone: 'utc',
    debug: ['ComQueryPacket', 'RowDataPacket']
  },
}