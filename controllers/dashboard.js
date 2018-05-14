const bcrypt = require('bcrypt');
const dashboard = require('../models/Dashboard');
const db = require('../db');

/**
 * ===========================================
 * Controller logic
 * ===========================================
 */

const getTickers = (req, res) => {
  console.log("controller", req.body.token)
  dashboard.verify(req.body.token, (err2, results) => {
    // expects either an array or undefined
    console.log("controller results", results);
    let payload = JSON.stringify({ payload: results });
    res.status(201).send(payload);
  })
}

/**
 * ===========================================
 * Export controller functions as a module
 * ===========================================
 */
 module.exports = {
   getTickers
 }
