'use strict'

const User = require('../../models/user')

module.exports.getUser = async (req, res, next) => {
  try {
    const result = await User.findOne({id: req.user_id})
    if (result) res.status(200).json(result)
    else res.status(404).json()
  }
  catch (err) {
    next(err)
  }
}

