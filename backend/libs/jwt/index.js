const jwt = require('jsonwebtoken')
const fs = require('fs')
const User = require('../../models/user')
const privateKey = fs.readFileSync(`${__dirname}/private.pem`)
const publicKey = fs.readFileSync(`${__dirname}/public.pem`)

module.exports.refreshToken = async (options) => {
  try {
    const payload = await jwt.verify(options.accessToken, publicKey, {algorithms: 'RS256', ignoreExpiration: true})
    const {refresh} = await User.findOne({user_id: payload.sub})
    await jwt.verify(options.refreshToken, refresh, {algorithms: 'HS256'})
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti
    return await this.createAccessToken({user_id: payload.sub})
  } catch (err) {
    throw {status: 401, message: err}
  }
}

module.exports.createAccessToken = async (data) => {
  try {
    const payload = {
      sub: data.user_id
    }
    return await jwt.sign(payload, privateKey,
      {
        algorithm: 'RS256',
        expiresIn: 60 * 60
      })
  } catch (err) {
    throw err
  }
}

module.exports.createRefreshToken = async (data, tokenSecret) => {
  try {
    const payload = {
      sub: data.user_id
    }
    return await jwt.sign(payload, tokenSecret,
      {
        algorithm: 'HS256',
        expiresIn: 60 * 60 * 24 * 6
      })
  } catch (err) {
    throw err
  }
}

module.exports.decodeToken = async (token) => {
  try {
    return await jwt.verify(token, publicKey, {algorithms: 'RS256'})
  } catch (err) {
    throw {status: 401, message: err}
  }
}

