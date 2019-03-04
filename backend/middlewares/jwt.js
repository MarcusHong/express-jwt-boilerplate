'use strict'

const Jwt = require('../libs/jwt')

module.exports = async (req, res, next) => {
  try {
    let {authorization} =  req.headers
    if (authorization && authorization.split(' ')[0] === 'Bearer') {
      const jwtToken = await Jwt.decodeToken(req.headers.authorization)
      if (jwtToken.sub) {
        req.user_id = jwtToken.sub
        return next()
      }
    }
    next({status: 401, message: 'invalid_access_token'})
  }
  catch (err) {
    next(err)
  }
}

