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

describe('Testing Password Change', () => {
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

  const changeCredential = {
    current_password: adminCredentials.password,
    new_password: 'a_new_password'
  }

  it('should change user password successfully', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/change/password')
      .set('Authorization', 'Bearer ' + token)
      .send(changeCredential)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.equal('Password changed successfully')
        done()
      })
  })
})
