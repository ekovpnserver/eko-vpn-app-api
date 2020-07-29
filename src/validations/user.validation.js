'use strict'

const Joi = require('joi')

// User validation rules
module.exports = {
  create: {
    body: {
      account_number: Joi.string().optional(),
      referral_code: Joi.string().optional(),
      referred_by: Joi.string().optional(),
      account_type: Joi.string().optional().valid('paid', 'free'),
      vpn_credits: Joi.string().optional(),
      active: Joi.boolean().optional().valid(true, false)
    }
  },
  edit: {
    body: {
      account_number: Joi.string(),
      referral_code: Joi.string(),
      referred_by: Joi.string(),
      account_type: Joi.string().valid('paid', 'free'),
      vpn_credits: Joi.string(),
      active: Joi.boolean().valid(true, false),
      order_number: Joi.string(),
      order_date: Joi.date()
    }
  }
}
