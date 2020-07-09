'use strict'
const express = require('express')
const router = express.Router()
const appRouter = require('./app')
const config = require('../../config')

router.get('/status', (req, res) => { res.send({status: `${config.app} is OK`}) }) // api status

router.use('/app', appRouter) // mount app paths

module.exports = router
