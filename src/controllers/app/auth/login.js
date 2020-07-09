'use strict'

const App = require('../../../models/apps')
const jwt = require('jsonwebtoken')
const config = require('../../../config')
const httpStatus = require('http-status')

exports.authApp = async (req, res, next) => {
  try {
    const app = await App.findAndGenerateToken(req.body)
    const payload = {sub: app.id}
    const token = jwt.sign(payload, config.secret,
      {
        expiresIn: '24h' // expires in 24 hours //input is in seconds
      })
    return res.json({ success: true, message: 'login successful', token: token, app: app.transform() })
  } catch (error) {
    next(error)
  }
}

exports.getApp = async (req, res, next) => {
  try {
    const app = await App.findOne({_id: req.user.id})

    if (!app) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'Error fetching app' })
    }
    res.status(httpStatus.OK)
    res.send({ success: true, message: 'App fetched successfully', app })
  } catch (error) {
    return next((error))
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const app = await App.findOne({_id: req.user.id})

    if (!app) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'Invalid Token' })
    }

    const payload = {sub: app.id}
    const refreshToken = jwt.sign(payload, config.secret,
      {
        expiresIn: '24h' // expires in 24 hours //input is in seconds
      })

    const data = {
      refreshToken,
      expiry: '24 hours'
    }
    res.status(httpStatus.OK)
    res.send({ success: true, message: 'Token refreshed successfully', data })
  } catch (error) {
    return next((error))
  }
}
