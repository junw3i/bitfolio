const bcrypt = require('bcrypt');
const user = require('../models/user');
const db = require('../db');

/**
 * ===========================================
 * Controller logic
 * ===========================================
 */

const create = (req, res) => {

    user.create(req.body, (err, queryRes) => {
      if (err) {
        // manually assign flash message as flash will only read on next req (not re-render)
        res.status(401).send({ message: "Email is in use or something went wrong." });
      } else {
        // console.log("token", queryRes.token);
        res.status(201).send({ token: queryRes.token});
      }
    });
}

const login = (req, res) => {
  user.login(req.body.email, req.body.password, (err, results) => {
    console.log("after callback", err, results)
    if (results.invalidCredentials == true) {
      console.log("login unsuccessful");
      res.status(401).send({ message: "The username or password don't match" });
    } else {
      console.log('login successful');
      res.status(201).send({ token: results.token});
    }
  })
}

const logout = (req, res) => {
  // res.clearCookie('id');
  // res.clearCookie('name');
  req.session.authenticated = false;
  req.logout()
  res.redirect('/');
}

/**
 * ===========================================
 * Export controller functions as a module
 * ===========================================
 */
 module.exports = {
   create,
   login,
   logout
 }
