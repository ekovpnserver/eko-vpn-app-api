/* eslint-disable no-dupe-keys */
/* eslint-disable camelcase */
'use strict'

const User = require('../../models/user')
const Referral = require('../../models/referral')
const httpStatus = require('http-status')

exports.updateUser = async (req, res, next) => {
  try {
    await User.findOneAndUpdate({_id: req.params.user}, req.body, {new: true}, (error, user) => {
      if (error || user === null) {
        res.status(httpStatus.BAD_REQUEST)
        res.send({ success: false, message: 'cannot update user', error })
      }

      if (user) {
        res.status(httpStatus.OK)
        res.send({ success: true, message: 'user updated successfully', data: user })
      }
    })
  } catch (error) {
    next(error)
  }
}

exports.updateUserReferral = async (req, res, next) => {
  try {
    const referred_by = req.body.referred_by
    const user = await User.findById(req.params.user)

    if (user.referred_by !== null) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'user already has a referral code' })
      return
    }

    if (user.referral_code === referred_by) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'cannot update self referral code' })
      return
    }
    const referral = await User.findOne({referral_code: referred_by})
    if (!referral) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'invalid referral code supplied' })
      return
    } else {
      // store the referral code
      const ref = new Referral()
      ref.account_number = user.account_number
      ref.referral_code = referral.referral_code
      ref.referred_by = referral.account_number
      ref.save()
    }

    // save the ref code
    user.referred_by = referred_by
    user.save()

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'user referral updated successfully', data: user })
  } catch (error) {
    next(error)
  }
}

exports.deleteUserDevice = async (req, res, next) => {
  try {
    const user = await User.findOne({account_number: req.params.account})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', user })
    }

    let imeiArr = user.imeis

    let imeiCheck = imeiArr.includes(req.params.imei)
    if (imeiCheck === true) { // user IMEI included in the user lists of imeis, remove it
      var index = user.imeis.indexOf(req.params.imei)
      user.imeis.splice(index, 1)
      user.save()
    } else {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user device' })
    }

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'user device removed successfully', data: user })
  } catch (error) {
    next(error)
  }
}

exports.extendMinutes = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.user)
    if (user === null) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'Cannot update user' })
      return
    }

    var d = new Date()
    var expiry = new Date()
    expiry.setMinutes(d.getMinutes() + (parseInt(req.body.milliseconds) / 60000))

    user.time_expiry = expiry
    user.save()

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'User time expiry updated successfully', data: user })
  } catch (error) {
    next(error)
  }
}

exports.claimUserReferral = async (req, res, next) => {
  try {
    const user = await User.findOne({account_number: req.params.account})

    if (!user) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'error fetching user', user })
    }

    // check if unclaimed referral exists
    const refs = await Referral.find({referred_by: req.params.account, claimed: false})

    refs.forEach(ref => {
      // do something for the claim

      // update the referral to claimed
      ref.claimed = true
      ref.save()
    })

    res.status(httpStatus.OK)
    res.send({ success: true, message: `users has claimed ${refs.length} referral(s) successfully`, data: refs.length })
  } catch (error) {
    next(error)
  }
}

exports.confirmSub = async (req, res, next) => {
  try {
    var data = JSON.parse(Buffer.from(req.body.message.data, 'base64').toString())
    console.log(data.subscriptionNotification)
    const user = await User.findOne({purchase_token: data.subscriptionNotification.purchaseToken})
    // console.log(user)
    if (user === null || user.purchase_token === null) {
      res.status(httpStatus.BAD_REQUEST)
      res.send({ success: false, message: 'Cannot update user' })
      return
    }

    if (data.subscriptionNotification.notificationType === 2 || data.subscriptionNotification.notificationType === 4 || data.subscriptionNotification.notificationType === 7) { // process any payment successful code
      // collect the sub type and process expiry
      var sub = data.subscriptionNotification.subscriptionId

      var d = new Date()
      var expiry = new Date()
      var monthMilliseconds = 2629800000
      if (sub === 'unlimited_for_one_month') { // top up user expiry for one month
        expiry.setMinutes(d.getMinutes() + (parseInt(monthMilliseconds) / 60000))
        user.time_expiry = expiry
        user.renewal_at = expiry
        user.subscription_type = 'monthly'
        user.save()
      } else if (sub === 'unlimited_for_one_year') { // top up user expiry for one year
        expiry.setMinutes(d.getMinutes() + (parseInt(monthMilliseconds * 12) / 60000))

        user.time_expiry = expiry
        user.renewal_at = expiry
        user.subscription_type = 'yearly'
        user.save()
      } else {

      }
      user.account_type = 'paid'
      user.save()
    }

    if (data.subscriptionNotification.notificationType === 3) { // payment cancellation
      user.account_type = 'canceled'
      user.save()
    }

    if (data.subscriptionNotification.notificationType === 13) { // payment expiry
      user.account_type = 'free'
      user.save()
    }

    // return a 200 to the google endpoint to acknowledge the subscription
    res.status(httpStatus.OK)
    res.send({ success: true, message: `user subscription handled successfully` })
  } catch (error) {
    next(error)
  }
}
