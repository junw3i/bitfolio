/**
 * Postgres database configuration.
 *
 * Import models and `pg` package.
 * Initialise configuration object with database credentials.
 * Initialise the connection pool with config object.
 *
 * Export the pool and models as a module using `module.exports`.
 */

//  remove import models
const url = require('url');
var redis = require("redis"),
    r = redis.createClient();
const {promisify} = require('util');


// require('dotenv').config()

r.on("error", function (err) {
    console.log("Redis Error " + err);
});


const getAsync = promisify(r.get).bind(r);

var mysql      = require('mysql');
var connection = mysql.createPool({
  connectionLimit : 10,
  host     : process.env.SQL_HOSTNAME_SG,
  user     : process.env.SQL_USERNAME_SG,
  password : process.env.SQL_PASSWORD_SG,
  database : process.env.SQL_DB_SG
});

console.log("HASHDAHSDAHS", process.env.SQL_HOSTNAME_SG);

// sample query
// connection.query("select * from daily limit 1;", function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].year);
// });

module.exports = {
  pool: connection,
  r,
  getAsync
}
