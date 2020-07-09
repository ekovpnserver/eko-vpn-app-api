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

chai.use(chaiHttp)

describe('Testing Password Reset', () => {
  // create super admin user by creating a signup token and calling register endpoint
  const generatedAdminEmail = 'super-admin-' + Math.random().toString(36).substring(2, 15) + '@test.com'
  const adminCredentials = {
    email: generatedAdminEmail,
    password: 'testtest',
    active: true,
    role: 'admin'
  }
  const payload = {email: adminCredentials.email, role: adminCredentials.role}
  const inviteToken = jwt.sign(payload, config.secret)

  const adminRegCred = {
    inviteToken,
    password: adminCredentials.password,
    active: adminCredentials.active
  }

  // before testing password reset, create a user to reset
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(adminRegCred)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        done()
      })
  })

  const forgotCredential = {
    email: adminCredentials.email
  }

  it('should send a password reset link to user email', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/forgot/password')
      .send(forgotCredential)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        done()
      })
  })
})
