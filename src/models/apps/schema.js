const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roles = [
  'apps'
]

const schema = new Schema({
  appName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  appId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  appSecret: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 128,
    select: false
  },
  active: {
    type: Boolean,
    default: true
  },
  role: {
    type: String,
    default: 'apps',
    enum: roles
  }
}, {
  timestamps: true
})

module.exports = { schema, roles }
