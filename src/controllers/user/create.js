'use strict'

const User = require('../../models/user')
const httpStatus = require('http-status')
const randomstring = require('randomstring')

exports.createUser = async (req, res, next) => {
  try {
    if (!req.body.account_id) {
      let userGeneratedData = {
        account_id: randomstring.generate({
          length: 16,
          charset: 'alphanumeric'
        }),
        referral_id: randomstring.generate({
          length: 10,
          charset: 'alphanumeric'
        })
      }
      Object.assign(req.body, userGeneratedData)
    }
    const appData = new User(req.body)

    const user = await appData.save()
    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'Error creating user' })
    }

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'User created successfully', user })
  } catch (error) {
    return next(error)
  }
}
