'use strict'

const express = require('express')
const router = express.Router()
const authController = require('../../../controllers/app/auth')
const userController = require('../../../controllers/user')
const appController = require('../../../controllers/app')
const auth = require('../../../middlewares/authorization')
const validator = require('express-validation')
const { create, edit } = require('../../../validations/user.validation')

router.post('/authenticate', authController.authApp) // login
router.get('/authenticated', auth('apps'), authController.getApp) // get logged in app
router.get('/authenticate/refresh-token', auth('apps'), authController.refreshToken) // refresh app token

router.post('/user', validator(create), auth('apps'), userController.createUser) // create a user
router.get('/user/id/:user', auth('apps'), userController.getUserByID) // get a user by ID
router.get('/user/claim-referral/:account', auth('apps'), userController.claimUserReferral) // claim a user referral by account
router.get('/user/account/:account/imei/:imei', auth('apps'), userController.getUserByAccountImei) // get a user by account ID and IMEI
router.delete('/user/account/:account/imei/:imei', auth('apps'), userController.deleteUserDevice) // delete a user device by account ID and IMEI
router.get('/user/account/:account', auth('apps'), userController.getUserByAccount) // get a user by account ID
router.put('/user/id/:user', validator(edit), auth('apps'), userController.updateUser) // update a user by id
router.get('/user/order/:order', auth('apps'), userController.findUserByOrderNumber) // find a user by order number
router.put('/user/extendminutes/:user', auth('apps'), userController.extendMinutes) // extend user minutes

router.get('/json/setup', auth('apps'), appController.setUp) // get the setup json
router.get('/json/ads', auth('apps'), appController.ads) // get the ads json
module.exports = router
