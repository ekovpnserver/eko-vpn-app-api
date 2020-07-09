const mongoose = require('mongoose')
const { schema } = require('./schema')

// hash the password before saving it
schema.method({
  transform () {
    const transformed = {}
    const fields = ['account_id', 'referral_id', 'referred_by', 'role', 'account_type', 'vpn_credits', 'renewal_at', 'active']

    fields.forEach((field) => {
      transformed[field] = this[field]
    })

    return transformed
  }
})

const User = mongoose.model('User', schema)
module.exports = User
