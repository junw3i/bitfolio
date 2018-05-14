const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');

/**
* ===========================================
* Export model functions as a module
* ===========================================
*/

module.exports = {
  verify: (token, callback) => {
    jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {
      let user_id = decoded.id;
      // fetch users_watchlist
      db.pool.getConnection((err, connection) => {
        connection.query(`select ticker, source, created_at_utc from users_watchlist where user_id=${user_id} and is_live=1`, (err2, res2) => {
          connection.release();
          if (err) {
            console.error("unable to retrive users_watchlist: ", err.stack);
          }
          let userTickers;
          if (res2.length > 0) {
            userTickers = res2;
          }
          callback(err2, userTickers );
        })
      });
    })
  }
}
