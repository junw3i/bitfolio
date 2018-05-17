const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const utils = require('../utils');

/**
* ===========================================
* Export model functions as a module
* ===========================================
*/

module.exports = {
  verify: (payload, callback) => {

      // fetch users_watchlist
      db.pool.getConnection((err, connection) => {
        connection.query(`select id, ticker, source, created_at_utc from users_watchlist where user_id=${payload.user_id} and is_live=1`, (err2, res2) => {
          connection.release();
          if (err) {
            console.error("unable to retrive users_watchlist: ", err.message);
          }
          let userTickers;
          if (res2.length > 0) {
            userTickers = res2;
          }
          callback(err2, userTickers );
        })
      });

  },
  saveTicker: (payload, callback) => {
      db.pool.getConnection((err, connection) => {
        connection.query(`insert into users_watchlist (ticker, source, created_at_utc, user_id) VALUES ('${payload.ticker}', '${payload.source}', now(), ${payload.user_id})`, (err2, results) => {
          if (err2) {
            console.error("unable to insert users_watchlist: ", err.message);
          }
          connection.release();
          callback({results: "done"});
        })
      })
  },
  removeTicker: (payload, callback) => {
    db.pool.getConnection((err, connection) => {
      connection.query(`update users_watchlist set is_live=0 where id=${payload.id}`, (err2, results) => {
        if (err2) {
          console.error("unable to kill ticker in users_watchlist: ", err.message);
        }
        connection.release();
        callback({results: "done"});
      })
    })
  },
  benchmark: (payload, callback) => {
    db.pool.getConnection((err, connection) => {
      connection.query(`select price, returns, utc_datetime, ticker from daily where ticker='${payload}' order by utc_datetime desc limit 1`, (err2, results) => {
        if (err2) {
          console.error("unable to fetch daily returns for ${payload}: ", err.message);
        }
        connection.release();
        let data;
        if (results.length > 0) {
          data = results[0];
        }
        callback(data);
      })
    })
  },
  savePortfolio: (payload, callback) => {
      db.pool.getConnection((err, connection) => {
        connection.query(`insert into users_tables (portfolio_name, asset_type, created_at_utc, user_id) VALUES ('${payload.portfolioName}', '${payload.asset_type}', now(), ${payload.user_id})`, (err2, results) => {
          if (err2) {
            console.error("unable to insert users_tables: ", err.message);
          }
          connection.release();
          callback({results: "done"});
        })
      })
  },
  getPortfolio: (payload, callback) => {
      db.pool.getConnection((err, connection) => {
        connection.query(`select id, portfolio_name, asset_type from users_tables where is_live=1 and user_id=${payload.user_id}`, (err2, results) => {
          if (err2) {
            console.error("unable to fetch users_tables: ", err2.stack);
          }
          connection.release();
          let userPortfolios;
          if (results !== undefined && results.length > 0) {
            userPortfolios = results;
          }
          callback(userPortfolios);
        })
      })
  },
  getActivities: (payload, callback) => {
    db.pool.getConnection((err, connection) => {
      connection.query(`select activity_date, ticker, type, quantity, price, net_proceeds from activities where is_live=1 and portfolio_id=${payload.portfolio_id} order by activity_date desc limit 10`, (err2, results) => {
        if (err2) {
          console.error("unable to fetch activity table: ", err2.stack);
        }
        connection.release();
        let userActivities;
        if (results !== undefined && results.length > 0) {
          userActivities = results;
        }
        callback(userActivities);
      })
    })
  },
  getEODNav: (payload, callback) => {
    db.pool.getConnection((err, connection) => {
      connection.query(`select nav, returns, datetime_utc from nav_table where is_live=1 and portfolio_id=${payload.portfolio_id} order by datetime_utc desc limit 1`, (err2, results) => {
        if (err2) {
          console.error("unable to fetch eod nav: ", err2.stack);
        }
        connection.release();
        let eodNAV;
        if (results !== undefined && results.length > 0) {
          eodNAV = results[0];
        }
        callback(eodNAV);
      })
    })
  }
}
