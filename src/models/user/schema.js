const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roles = [
  'user'
]

const userTypes = [
  'paid', 'free'
]

const schema = new Schema({
  account_number: {
    type: String,
    required: true,
    unique: true
  },
  referral_code: {
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
  order_number: {
    type: String,
    default: null
  },
  order_data: {
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
  },
  imeis: {
    type: Array,
    validate: [arrayLimit, '{PATH} exceeds the limit of 3']
  },
}, {
  timestamps: true
})

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = { schema, roles }
