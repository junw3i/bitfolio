const bcrypt = require('bcrypt');
const api = require('../models/api');
const db = require('../db');

/**
 * ===========================================
 * Controller logic
 * ===========================================
 */

const getTickers = (req, res) => {
  api.verify(req.body.token, (err2, results) => {
    // expects either an array or undefined
    let payload = JSON.stringify({ payload: results });
    res.status(201).send(payload);
  })
}

const saveTicker = (req, res) => {
  api.saveTicker(req.body, (results2) => {
    let payload = JSON.stringify(results2);
    res.status(201).send(payload);
  })
}



/**
 * ===========================================
 * Export controller functions as a module
 * ===========================================
 */
 module.exports = {
   getTickers,
   saveTicker
 }
