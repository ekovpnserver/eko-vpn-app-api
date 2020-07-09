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

describe('Testing User/Admin Login', () => {
  // create user to test login with
  const generatedUserEmail = 'admin-' + Math.random().toString(36).substring(2, 15) + '@test.com'
  const userCredentials = {
    email: generatedUserEmail,
    password: 'testtest',
    active: true,
    role: 'admin'
  }
  const payload = {email: userCredentials.email, role: userCredentials.role}
  const inviteToken = jwt.sign(payload, config.secret)

  const userRegCred = {
    inviteToken,
    password: userCredentials.password,
    active: userCredentials.active
  }

  const rejectedCredentials = {
    email: 'test',
    password: 'test'
  }

  // before testing login, create a user to login with
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(userRegCred)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        done()
      })
  })

  it('should fail login with invalid data', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(rejectedCredentials)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(404)
        res.body.should.be.a('object')
        done()
      })
  })

  it('should login correct data', (done) => {
    chai
      .request(app)
      .post('/api/v1/auth/login')
      .send(userCredentials)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })
})
