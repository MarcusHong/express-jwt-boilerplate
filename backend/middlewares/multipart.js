'use strict'

const multer  = require('multer')
const uuid = require('uuid/v4')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/tmp')
  },
  filename: (req, file, cb) => {
    cb(null, uuid())
  }
})

const upload = multer({ storage: storage })

module.exports = (names) => {
  if (names.length === 1) {
    return upload.array(names[0])
  }
  return upload.fields(names.map(name => ({name})))
}