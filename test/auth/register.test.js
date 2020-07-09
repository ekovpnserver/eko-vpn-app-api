/* eslint-disable no-undef */
'use strict'

process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../src/index').app
// eslint-disable-next-line no-unused-vars
const should = chai.should()
const jwt = require('jsonwebtoken')
const config = require('../../src/config')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

chai.use(chaiHttp)

describe('Testing User Registration', () => {
  const schema = Joi.object().keys({
    id: Joi.objectId(),
    firstname: Joi.string().allow(null).optional(),
    lastname: Joi.string().allow(null).optional(),
    phone: Joi.string().allow(null).optional(),
    email: Joi.string().email({ tlds: { allow: false } }),
    role: Joi.string().allow(null).optional(),
    createdAt: Joi.date(),
    avatar: Joi.string().allow(null).optional()
  })
  // get a random email address and encode it to a valid invite token
  const generatedUserEmail = 'admin-' + Math.random().toString(36).substring(2, 15) + '@test.com'
  const userDetails = {
    email: generatedUserEmail,
    password: 'testtest',
    role: 'admin'
  }
  const payload = {email: userDetails.email, role: userDetails.role}
  const inviteToken = jwt.sign(payload, config.secret)

  const rejectedCredentials = {
    inviteToken: 'test',
    password: 'test'
  }

  const correctCredentials = {
    inviteToken,
    password: userDetails.password
  }

  it('should fail user creation with invalid data', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(rejectedCredentials)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(400)
        res.body.should.be.a('object')
        done()
      })
  })

  it('should create user with correct data', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(correctCredentials)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.user.email.should.be.equal(userDetails.email)
        should.equal(Joi.validate(res.body.user, schema).error, null)
        done()
      })
  })
})
