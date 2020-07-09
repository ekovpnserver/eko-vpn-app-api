'use strict'

const User = require('../../models/user')
const httpStatus = require('http-status')

exports.updateUser = async (req, res, next) => {
  try {
    await User.findOneAndUpdate({_id: req.params.user}, req.body, {new: true}, (error, user) => {
      if (error || user === null) {
        res.status(httpStatus.BAD_REQUEST)
        res.send({ success: false, message: 'cannot update user', error })
      }

      if (user) {
        res.status(httpStatus.CREATED)
        res.send({ success: true, message: 'user updated successfully', data: user })
      }
    })
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
    res.send({ success: true, message: 'User time expiry updated successfully', user })
  } catch (error) {
    next(error)
  }
}
