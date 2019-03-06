'use strict'

const JWT = require('../../libs/jwt')
const User = require('../../models/user')
const db = require('../../components/db')

module.exports.postRegister = async (req, res, next) => {
  const connection = await db.beginTransaction()
  try {
    const {email, password} = req.options
    const {user, refreshHash} = await User.createUser({email, password}, connection)
    const accessToken = await JWT.createAccessToken({user_id: user.id})
    const refreshToken = await JWT.createRefreshToken(user, refreshHash)
    await db.commit(connection)
    res.status(201).json({accessToken, refreshToken})
  }
  catch (err) {
    await db.rollback(connection)

    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json()
    }
    else next(err)
  }
}

module.exports.postAuth = async (req, res, next) => {
  try {
    const {email, password} = req.options

    const user = await User.findOne({email})
    if (user && await User.verifyPassword(password, user.password, user.salt)) {
      const accessToken = await JWT.createAccessToken({user_id: user.id})
      const refreshToken = await JWT.createRefreshToken(user, user.refresh)
      res.status(200).json({accessToken, refreshToken})
    }
    else {
      res.status(404).json()
    }
  }
  catch (err) {
    next(err)
  }
}

module.exports.putAuth = async (req, res, next) => {
  try {
    const {password, newPassword} = req.options
    if (password === newPassword) return res.status(409).json()

    const user = await User.findOne({id: req.user_id})
    if (user && await User.verifyPassword(password, user.password, user.salt)) {
      const refreshSecret = await User.updatePassword({user_id: req.user_id, password: newPassword})
      const refreshToken = await JWT.createRefreshToken({user_id: req.user_id}, refreshSecret)
      res.status(200).json({refreshToken})
    }
    else {
      res.status(404).json()
    }
  }
  catch (err) {
    next(err)
  }
}

module.exports.deleteAuth = async (req, res, next) => {
  try {
    res.status(204).json()
  }
  catch (err) {
    next(err)
  }
}

module.exports.postRefresh = async (req, res, next) => {
  try {
    const accessToken = await JWT.refreshToken(req.options)
    res.status(201).json({accessToken})
  }
  catch (err) {
    next(err)
  }
}
