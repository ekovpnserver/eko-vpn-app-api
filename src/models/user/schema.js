const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roles = [
  'user'
]

const userTypes = [
  'paid', 'free'
]

const schema = new Schema({
  account_id: {
    type: String,
    required: true,
    unique: true
  },
  referral_id: {
    type: String,
    default: null
  },
  referred_by: {
    type: String,
    default: null
  },
  role: {
    type: String,
    default: 'user',
    enum: roles
  },
  account_type: {
    type: String,
    default: 'free',
    enum: userTypes
  },
  vpn_credits: {
    type: Number,
    default: 0.00
  },
  renewal_at: {
    type: Date,
    default: null
  },
  time_expiry: {
    type: Date,
    default: Date.now()
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

module.exports = { schema, roles }
