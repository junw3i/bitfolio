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
require('dotenv').config()
// //check to see if we have this heroku environment variable
// if( process.env.DATABASE_URL ){

//   //we need to take apart the url so we can set the appropriate configs

//   const params = url.parse(process.env.DATABASE_URL);
//   const auth = params.auth.split(':');

//   //make the configs object
//   var configs = {
//     user: auth[0],
//     password: auth[1],
//     host: params.hostname,
//     port: params.port,
//     database: params.pathname.split('/')[1],
//     ssl: true
//   };

// } else {
//   var configs = {
//     user: 'cj',
//     host: '127.0.0.1',
//     database: 'reminders',
//     port: 5432
//   };
// }

var mysql      = require('mysql');
var connection = mysql.createPool({
  connectionLimit : 10,
  host     : process.env.SQL_HOSTNAME_SG,
  user     : process.env.SQL_USERNAME_SG,
  password : process.env.SQL_PASSWORD_SG,
  database : process.env.SQL_DB_SG
});

// sample query
// connection.query("select * from daily limit 1;", function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].year);
// });

module.exports = {
  pool: connection
}
