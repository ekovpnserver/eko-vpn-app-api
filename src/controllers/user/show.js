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

    if (req.query.imei) {
      let imeiArr = user.imeis

      let imeiCheck = imeiArr.includes(req.query.imei)
      if (imeiCheck === false) { // user IMEI not included in the user lists of imeis, update
        if (imeiArr.length >= 3) {
          res.status(httpStatus.BAD_REQUEST)
          res.send({ success: false, message: 'user maximum devices exceeded' })
          return
        }
        user.imeis.push(req.query.imei)
        user.save()
      }
    }

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'user fetched successfully', data: user })
  } catch (error) {
    next(error)
  }
}

exports.getUserByAccount = async (req, res, next) => {
  try {
    const user = await User.findOne({account_number: req.params.account})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', user })
    }

    if (req.query.imei) {
      let imeiArr = user.imeis

      let imeiCheck = imeiArr.includes(req.query.imei)
      if (imeiCheck === false) { // user IMEI not included in the user lists of imeis, update
        if (imeiArr.length >= 3) {
          res.status(httpStatus.BAD_REQUEST)
          res.send({ success: false, message: 'user maximum devices exceeded' })
          return
        }
        user.imeis.push(req.query.imei)
        user.save()
      }
    }

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'user fetched successfully', data: user })
  } catch (error) {
    next(error)
  }
}

exports.getUserByAccountImei = async (req, res, next) => {
  try {
    const user = await User.findOne({account_number: req.params.account})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', user })
    }

    let imeiArr = user.imeis

    let imeiCheck = imeiArr.includes(req.params.imei)
    if (imeiCheck === false) { // user IMEI not included in the user lists of imeis, update
      if (imeiArr.length >= 3) {
        res.status(httpStatus.BAD_REQUEST)
        res.send({ success: false, message: 'user maximum devices exceeded' })
        return
      }
      user.imeis.push(req.params.imei)
      user.save()
    }

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'user fetched successfully', data: user })
  } catch (error) {
    next(error)
  }
}

exports.findUserByOrderNumber = async (req, res, next) => {
  try {
    const user = await User.findOne({order_number: req.params.order})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', data: user })
    }

    if (req.query.imei) {
      let imeiArr = user.imeis

      let imeiCheck = imeiArr.includes(req.query.imei)
      if (imeiCheck === false) { // user IMEI not included in the user lists of imeis, update
        if (imeiArr.length >= 3) {
          res.status(httpStatus.BAD_REQUEST)
          res.send({ success: false, message: 'user maximum devices exceeded' })
          return
        }
        user.imeis.push(req.query.imei)
        user.save()
      }
    }

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'user fetched successfully', data: user })
  } catch (error) {
    next(error)
  }
}
