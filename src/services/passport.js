'use strict'

const config = require('../config')
const App = require('../models/apps')
const passportJWT = require('passport-jwt')

const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

const jwtOptions = {
  secretOrKey: config.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}

const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  console.log(jwtPayload)
  App.findById(jwtPayload.sub, (err, app) => {
    if (err) {
      return done(err, null)
    }

    if (app) {
      return done(null, app)
    } else {
      return done(null, false)
    }
  })
})

exports.jwtOptions = jwtOptions
exports.jwt = jwtStrategy
