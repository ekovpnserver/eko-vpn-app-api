const mongoose = require('mongoose')
const { schema, roles } = require('./schema')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10
const httpStatus = require('http-status')
const APIError = require('../../utils/APIError')

// hash the password before saving it
schema.pre('save', function (next) {
  var app = this

  // only hash the password if it has been modified (or is new)
  if (!app.isModified('appSecret')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err)

    // hash the password along with our new salt
    bcrypt.hash(app.appSecret, salt, function (err, hash) {
      if (err) return next(err)

      // override the cleartext password with the hashed one
      app.appSecret = hash
      next()
    })
  })
})

schema.method({
  transform () {
    const transformed = {}
    const fields = ['id', 'appId', 'createdAt', 'role']

    fields.forEach((field) => {
      transformed[field] = this[field]
    })

    return transformed
  },

  passwordMatches (appSecret) {
    return bcrypt.compareSync(appSecret, this.appSecret)
  }
})

schema.statics = {
  roles,

  checkDuplicateAppidError (err) {
    if (err.code === 11000) {
      var error = new Error('App ID already exist')
      error.errors = [{
        field: 'appId',
        location: 'body',
        messages: ['App ID already exist']
      }]
      error.status = httpStatus.CONFLICT
      return error
    }

    return err
  },

  async findAndGenerateToken (payload) {
    const { appId, appSecret } = payload
    if (!appId) throw new APIError('App ID must be provided for login')

    const app = await this.findOne({ appId }).select('+appSecret').exec()
    if (!app) throw new APIError(`Incorrect login credentials`, httpStatus.NOT_FOUND)

    const appSecretOK = await app.passwordMatches(appSecret)

    if (!appSecretOK) throw new APIError(`Incorrect login credentials`, httpStatus.UNAUTHORIZED)

    return app
  }
}

const App = mongoose.model('App', schema)
module.exports = App
