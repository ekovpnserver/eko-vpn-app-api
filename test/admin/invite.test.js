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

describe('Testing User Invitation', () => {
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

  // create super admin user by creating a signup token and calling register endpoint
  const generatedAdminEmail = 'super-admin-' + Math.random().toString(36).substring(2, 15) + '@test.com'
  const adminCredentials = {
    email: generatedAdminEmail,
    password: 'testtest',
    active: true,
    role: 'super-admin'
  }
  const payload = {email: adminCredentials.email, role: adminCredentials.role}
  const inviteToken = jwt.sign(payload, config.secret)

  const adminRegCred = {
    inviteToken,
    password: adminCredentials.password,
    active: adminCredentials.active
  }

  // before testing login, create a user to login with
  var token = null
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(adminRegCred)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        token = res.body.token
        done()
      })
  })

  // get a random email address
  const generatedEmail = 'user' + Math.random().toString(36).substring(2, 15) + '@test.com'

  const correctCredentials = {
    email: generatedEmail
  }

  const rejectedCredentials = {
    email: 'test'
  }

  it('should fail user invitation with invalid data', (done) => {
    chai
      .request(app)
      .post('/api/v1/admin/invite')
      .set('Authorization', 'Bearer ' + token)
      .send(rejectedCredentials)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(400)
        res.body.should.be.a('object')
        done()
      })
  })

  it('should invite user with correct data', (done) => {
    chai
      .request(app)
      .post('/api/v1/admin/invite')
      .set('Authorization', 'Bearer ' + token)
      .send(correctCredentials)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        should.equal(Joi.validate(res.body.user, schema).error, null)
        done()
      })
  })
})
