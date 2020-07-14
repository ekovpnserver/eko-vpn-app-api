'use strict'

const httpStatus = require('http-status')
const fs = require('fs')

exports.setUp = async (req, res, next) => {
  try {
    let rawdata = fs.readFileSync('servers.json')
    let servers = JSON.parse(rawdata)

    res.status(httpStatus.OK)
    res.send({ success: true, message: 'servers fetched successfully', data: servers })
  } catch (error) {
    next(error)
  }
}
