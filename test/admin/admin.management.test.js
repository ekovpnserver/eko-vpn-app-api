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

describe('Admin Management', () => {
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

  // before testing admin management, create a user to login with
  var token = null
  var admiId = null
  before((done) => {
    chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(adminRegCred)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(201)
        res.body.should.be.a('object')
        admiId = res.body.user.id
        token = res.body.token
        done()
      })
  })

  it('should list all admins', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })

  it('should get a particular admin', (done) => {
    chai
      .request(app)
      .get('/api/v1/admin/' + admiId)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })

  const updateData = {
    firstname: 'TestFirstname'
  }

  it('should update a particular admin', (done) => {
    chai
      .request(app)
      .put('/api/v1/admin/' + admiId)
      .set('Authorization', 'Bearer ' + token)
      .send(updateData)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })

  it('should update a admin using the token', (done) => {
    chai
      .request(app)
      .put('/api/v1/admin/update')
      .set('Authorization', 'Bearer ' + token)
      .send(updateData)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })

  it('should delete a particular admin', (done) => {
    chai
      .request(app)
      .delete('/api/v1/admin/' + admiId)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        if (err) {}
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
  })
})
