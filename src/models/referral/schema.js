const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  account_number: {
    type: String,
    required: true
  },
  referral_code: {
    type: String,
    default: null,
    required: true
  },
  referred_by: {
    type: String,
    default: null,
    required: true
  },
  claimed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
})

module.exports = { schema }
