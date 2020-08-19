const mongoose = require('mongoose')
const { schema } = require('./schema')

const Referral = mongoose.model('Referral', schema)
module.exports = Referral
