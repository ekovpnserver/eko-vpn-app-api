'use strict'

const User = require('../../models/user')
const httpStatus = require('http-status')

exports.getUserByID = async (req, res, next) => {
  try {
    const user = await User.findOne({_id: req.params.user})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', user })
    }

    res.status(httpStatus.CREATED)
    res.send({ success: true, message: 'user fetched successfully', data: user.transform() })
  } catch (error) {
    next(error)
  }
}

exports.getUserByAccount = async (req, res, next) => {
  try {
    const user = await User.findOne({account_id: req.params.account})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', user })
    }

    res.status(httpStatus.CREATED)
    res.send({ success: true, message: 'user fetched successfully', data: user.transform() })
  } catch (error) {
    next(error)
  }
}

exports.findUserByOrderNumber = async (req, res, next) => {
  try {
    const user = await User.findOne({order_number: req.params.order})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', user })
    }

    res.status(httpStatus.CREATED)
    res.send({ success: true, message: 'user fetched successfully', data: user.transform() })
  } catch (error) {
    next(error)
  }
}
