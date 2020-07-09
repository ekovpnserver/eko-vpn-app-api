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

describe('Testing Logged In User Details', () => {
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

  // before testing insight, create a user to login with
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

  it('should return status code 200', (done) => {
    chai
      .request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.user.should.be.a('object')
        done()
      })
  })
})
