'use strict'
const express = require('express')
const router = express.Router()
const appRouter = require('./app')
const config = require('../../config')
var path = require('path')

router.get('/status', (req, res) => { res.send({status: `${config.app} is OK`}) }) // api status

router.get('/file-ads.json', (req, res) => {
  /* Insted of doing all this */
  // res.writeHead(200, {
  //    'Content-type': 'application/json'
  // });
  // res.end(JSON.stringify(data));

  /* Just send the file */
  res.sendFile(path.join(__dirname, '../../../', 'ads.json'))
})

router.get('/servers.json', (req, res) => {
  /* Insted of doing all this */
  // res.writeHead(200, {
  //    'Content-type': 'application/json'
  // });
  // res.end(JSON.stringify(data));

  /* Just send the file */
  res.sendFile(path.join(__dirname, '../../../', 'servers.json'))
})

router.use('/app', appRouter) // mount app paths

module.exports = router
