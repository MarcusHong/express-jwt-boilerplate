'use strict'

const Jwt = require('../libs/jwt')

module.exports = async (req, res, next) => {
  try {
    const jwtToken = await Jwt.decodeToken(req.headers.authorization)
    req.user_id = jwtToken.sub
    next()
  }
  catch (err) {
    next(err)
  }
}

module.exports.decodeToken = async (accessToken) => {
  const jwtToken = await Jwt.decodeToken(accessToken)
  return jwtToken.sub
}
