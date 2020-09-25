'use strict'

const User = require('../../models/user')
const Referral = require('../../models/referral')
const httpStatus = require('http-status')
const randomstring = require('randomstring')

exports.createUser = async (req, res, next) => {
  try {
    if (!req.body.account_number) {
      let userGeneratedData = {
        account_number: randomstring.generate({
          length: 16,
          charset: 'numeric'
        }),
        referral_code: randomstring.generate({
          length: 10,
          charset: 'alphanumeric',
          capitalization: 'uppercase'
        })
      }
      Object.assign(req.body, userGeneratedData)
    }

    const appData = new User(req.body)

    appData.imeis.push(req.body.imei)

    const user = await appData.save()

    // resave the time expiry
    user.time_expiry = user.createdAt
    user.save()

    // process referral if any
    if (req.body.referred_by) {
      const referral = await User.findOne({referral_code: req.body.referred_by})
      if (!referral) {
        // no referral matched with the code provided
      } else {
        // store the referral code
        const ref = new Referral()
        ref.account_number = user.account_number
        ref.referral_code = referral.referral_code
        ref.referred_by = referral.account_number
        ref.save()
      }
    }

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'Error creating user' })
    }

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'User created successfully', data: user })
  } catch (error) {
    return next(error)
  }
}
