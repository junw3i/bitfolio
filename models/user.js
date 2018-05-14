/**
* User model functions.
*
* Any time a database SQL query needs to be executed
* relating to a user (be it C, R, U, D, or Login),
* one or more of the functions here should be called.
*
* NOTE: You can add authentication logic in this model.
*
* Export all functions as a module using `module.exports`,
* to be imported (using `require(...)`) in `db.js`.
*/
const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');

/**
* ===========================================
* Export model functions as a module
* ===========================================
*/

module.exports = {
  login: (email, password, callback) => {
    // get pw hash
    db.pool.getConnection(function(err, connection) {


      connection.query(`select id, email, password from users where email='${email}'`, (err, res) => {
        if (err) {
          console.error("unable to retrive user's pw: ", err.stack);
        }
        let pwHash;
        console.log("query", res.length);
        if (res.length > 0) {
          pwHash = res[0].password;
        }
        bcrypt.compare(password, pwHash, (err2, res2) => {
          if (res2) {
            let payload = {
              id: res[0].id,
              email: res[0].email
            }
            let token = jwt.sign(payload, process.env.TOKEN_KEY);
            connection.release();
            callback(err2, { token: token });
          } else {
            connection.release();
            callback(err2, {invalidCredentials: true});
          }
        })
      })
    })

  },
    create: (user, callback) => {

      bcrypt.hash(user.password, 1, (err, hash) => {
        if (err) console.error('hash error', err);
        db.pool.getConnection(function(err, connection) {
          connection.query(`insert into users (email, password, created_at_utc) values ('${user.email}', '${hash}', now())`, (err, res) => {
            if (err) {
              console.error("unable to create user in db", err.stack);
              connection.release();
              callback(err, { token: '' });
            } else {
              connection.query(`SELECT LAST_INSERT_ID()`, (err2, res2) => {
                let payload = {
                  id: res2[0]["LAST_INSERT_ID()"],
                  email: user.email
                }
                let token = jwt.sign(payload, process.env.TOKEN_KEY);
                connection.release();
                callback(err, { token: token });
              })
            }
          })
        })
      });
    }
}
