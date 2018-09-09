const bcrypt = require('bcrypt');
const db = require('../db');
const jwt = require('jsonwebtoken');
const utils = require('../utils');
const async = require('async');
const axios = require('axios')

// recalcuates balance sheet for entire portfolio

const calculateFullBalance = (portfolio_id, callback) => {
  db.pool.query(`select ticker, sum(quantity) as 'net_quantity' from activities where (type='BUY' or type='SELL') and is_live=1 and portfolio_id=${portfolio_id} group by ticker HAVING net_quantity > 0`, (err2, results) => {
    if (err2) {
      console.error("unable to retrive balance: ", err2);
    }
    let balance;
    if (results.length > 0) {
      balance = results;
      db.pool.query(`update balance set is_live=0, created_at_utc=now() where is_live=1 and portfolio_id=${portfolio_id}`, (err3, results3) => {
        // update balance table
        async.forEachOf(results, (value, index, callback2) => {
          let queryString = `insert into balance (ticker, amount, is_live, created_at_utc, portfolio_id, portfolio_ticker) values ('${value.ticker}', '${value.net_quantity}', 1, now(), ${portfolio_id}, '${portfolio_id}_${value.ticker}') ON DUPLICATE KEY UPDATE amount='${value.net_quantity}', created_at_utc=now(), is_live=1`;
          db.pool.query(queryString, (err4, results4) => {
            console.log("index is done");
            callback2();
          })
        }, err => {
          if (err) console.error(err.message);
          // configs is now a map of JSON data
          console.log("ALL DONE");
          callback(balance);
        });
      })
    } else {
      // probably portfolio activty is empty
      console.log("NOTHING DONE");
      callback(balance);
    }
  })
}

// recalcuates balance sheet for specific ticker
const calculateBalance = (portfolio_id, ticker, callback) => {
  db.pool.query(`select sum(quantity) as 'net_quantity' from activities where (type='BUY' or type='SELL') and is_live=1 and portfolio_id=${portfolio_id} and ticker='${ticker}' group by ticker HAVING net_quantity > 0`, (err2, results) => {
    if (err2) {
      console.error("unable to retrive balance: ", err2);
    }
    let balance;
    if (results.length > 0) {
      balance = results;
      db.pool.query(`update balance set is_live=0, created_at_utc=now() where is_live=1 and portfolio_id=${portfolio_id} and ticker='${ticker}'`, (err3, results3) => {
        // update balance table
        let queryString = `insert into balance (ticker, amount, is_live, created_at_utc, portfolio_id, portfolio_ticker) values ('${ticker}', '${results[0].net_quantity}', 1, now(), ${portfolio_id}, '${portfolio_id}_${ticker}') ON DUPLICATE KEY UPDATE amount='${results[0].net_quantity}', created_at_utc=now(), is_live=1`;
        db.pool.query(queryString, (err4, results4) => {
          console.log("balance update done");
          callback(results[0].net_quantity);
        })
      })
    } else {
      // probably portfolio activty is empty
      console.log("NOTHING DONE");
      callback(balance);
    }
  })
}

const calculateBaseBalance = (portfolio_id, callback) => {
  db.pool.query(`select base_currency, sum(net_proceeds) as 'proceeds'  from activities where portfolio_id=${portfolio_id} and is_live=1 group by base_currency having proceeds > 0;`, (err2, results) => {
    if (err2) {
      console.error("unable to retrive users_watchlist: ", err2);
    }
    let balance;
    if (results.length > 0) {
      balance = results;
      // update balance table
      async.forEachOf(results, (value, index, callback2) => {
        let queryString = `insert into balance (ticker, amount, is_live, created_at_utc, portfolio_id, portfolio_ticker) values ('${value.base_currency}', '${value.proceeds}', 1, now(), ${portfolio_id}, '${portfolio_id}_${value.base_currency}') ON DUPLICATE KEY UPDATE amount='${value.proceeds}', created_at_utc=now(), is_live=1`;
        db.pool.query(queryString, (err4, results4) => {
          console.log("base_currency is done");
          callback2();
        })
      }, err => {
        if (err) console.error(err.message);
        // configs is now a map of JSON data
        console.log("ALL BASE DONE");
        baseCurrencies = JSON.parse(process.env.BASE_CURRENCY);
        callback(balance);
      });
    }
  })
}

const calculateCost = (portfolio_id, ticker, quantity, callback) => {
  db.pool.query(`select quantity, net_proceeds from activities where portfolio_id=${portfolio_id} and is_live=1 and ticker='${ticker}' order by activity_date desc;`, (err2, results) => {
    if (err2) {
      console.error("unable to retrive trades for avg cost calculation: ", err2);
    }
    let balance;
    let totalCost = 0;
    let quantityCounter = 0;
    if (results.length > 0) {
      balance = results;

      for (i = 0; i < balance.length; i++) {
        if (balance[i].quantity > 0) {
          if (balance[i].quantity + quantityCounter < quantity) {
            totalCost += balance[i].net_proceeds;
            quantityCounter += balance[i].quantity
          } else {
            // get pro-rate net proceeds
            let prorated = (quantity - quantityCounter) / balance[i].quantity;
            totalCost += prorated * balance[i].net_proceeds;
            break;
          }
        }

      }
      let avgCost = -(totalCost / quantity).toFixed(4);
      console.log("avg_cost:", avgCost);
      db.pool.query(`update balance set avg_cost='${avgCost}' where portfolio_ticker='${portfolio_id}_${ticker}'`, (err3, results2) => {
        callback(avgCost);
      })
    }
  })
}

module.exports = {
  verify: (payload, callback) => {
    // fetch users_watchlist
    db.pool.query(`select id, ticker, source, created_at_utc from users_watchlist where user_id=${payload.user_id} and is_live=1`, (err2, res2) => {
      if (err2) {
        console.error("unable to retrive users_watchlist: ", err2);
      }
      console.log(res2)
      let userTickers = [];
      if (res2.length > 0) {
        userTickers = res2;
      }
      callback(err2, userTickers);
    })

  },
  saveTicker: (payload, callback) => {
    db.pool.query(`insert into users_watchlist (ticker, source, created_at_utc, user_id) VALUES ('${payload.ticker}', '${payload.source}', now(), ${payload.user_id})`, (err2, results) => {
      if (err2) {
        console.error("unable to insert users_watchlist: ", err2);
      }
      callback({ results: "done" });
    })

  },
  removeTicker: (payload, callback) => {
    db.pool.query(`update users_watchlist set is_live=0 where id=${payload.id}`, (err2, results) => {
      if (err2) {
        console.error("unable to kill ticker in users_watchlist: ", err.message);
      }
      callback({ results: "done" });
    })
  },
  // get nav
  benchmark: (payload, callback) => {
    db.pool.query(`select price, returns, utc_datetime, ticker from daily where ticker='${payload}' order by utc_datetime desc limit 1`, (err2, results) => {
      if (err2) {
        console.error("unable to fetch daily returns for ${payload}: ", err.message);
      }
      let data;
      if (results.length > 0) {
        data = results[0];
      }
      callback(data);
    })
  },
  savePortfolio: (payload, callback) => {

    db.pool.query(`insert into users_tables (portfolio_name, asset_type, created_at_utc, user_id) VALUES ('${payload.portfolioName}', '${payload.asset_type}', now(), ${payload.user_id})`, (err2, results) => {
      if (err2) {
        console.error("unable to insert users_tables: ", err.message);
      }

      console.log("model return");
      callback({ results: "done" });
    })

  },
  getPortfolio: (payload, callback) => {

    db.pool.query(`select id, portfolio_name, asset_type from users_tables where is_live=1 and user_id=${payload.user_id}`, (err2, results) => {
      if (err2) {
        console.error("unable to fetch users_tables: ", err2.stack);
      }
      let userPortfolios;
      if (results !== undefined && results.length > 0) {
        userPortfolios = results;
      }
      callback(userPortfolios);
    })

  },
  getActivities: (payload, callback) => {

    db.pool.query(`select id, activity_date, ticker, type, quantity, price, net_proceeds from activities where is_live=1 and portfolio_id=${payload.portfolio_id} order by activity_date desc limit 15`, (err2, results) => {
      if (err2) {
        console.error("unable to fetch activity table: ", err2.stack);
      }
      let userActivities = [];
      if (results !== undefined && results.length > 0) {
        userActivities = results;
      }
      callback(userActivities);
    })

  },
  getEODNav: (payload, callback) => {

    db.pool.query(`select nav, returns, datetime_utc from nav_table where is_live=1 and portfolio_id=${payload.portfolio_id} order by datetime_utc desc limit 1`, (err2, results) => {
      if (err2) {
        console.error("unable to fetch eod nav: ", err2.stack);
      }
      let eodNAV = {};
      if (results !== undefined && results.length > 0) {
        eodNAV = results[0];
      }
      callback(eodNAV);
    })

  },
  saveActivities: (payload, callback) => {
    let string;
    if (payload.price == null && payload.quantity == null) {
      string = `'${payload.activity_ticker}', '${payload.type}', '${payload.activity_date}', null, null, '${payload.fees}', '${payload.net_proceeds}', now(), '${payload.portfolio_id}', '${payload.base_currency}'`;
    } else if (payload.price == null) {
      string = `'${payload.activity_ticker}', '${payload.type}', '${payload.activity_date}', null, '${payload.quantity}', '${payload.fees}', '${payload.net_proceeds}', now(), '${payload.portfolio_id}', '${payload.base_currency}'`;
    } else if (payload.quantity == null) {
      string = `'${payload.activity_ticker}', '${payload.type}', '${payload.activity_date}', '${payload.price}', null, '${payload.fees}', '${payload.net_proceeds}', now(), '${payload.portfolio_id}', '${payload.base_currency}'`;
    } else {
      string = `'${payload.activity_ticker}', '${payload.type}', '${payload.activity_date}', '${payload.price}', '${payload.quantity}', '${payload.fees}', '${payload.net_proceeds}', now(), '${payload.portfolio_id}', '${payload.base_currency}'`;
    }


    db.pool.query(`insert into activities (ticker, type, activity_date, price, quantity, fees, net_proceeds, created_at_utc, portfolio_id, base_currency) VALUES (${string})`, (err2, results) => {
      if (err2) {
        console.error("unable to insert activity: ", err2.stack);
      }

      if (payload.asset_type == 'shares') {
        // do balance
        calculateBalance(payload.portfolio_id, payload.activity_ticker, (results2) => {
          console.log("results2", results2)
          calculateBaseBalance(payload.portfolio_id, (results3) => {
            console.log("results2", results3)
            // calculate cost for ticker
            calculateCost(payload.portfolio_id, payload.activity_ticker, results2, (results4) => {
              callback(results3);
            })
          })
        })
      } else if (payload.asset_type == 'cryptocurrencies') {
        callback({ results: "done" })
      }
    })

  },
  getBalance: (payload, callback) => {
    db.pool.query(`select ticker, amount, avg_cost from balance where is_live=1 and portfolio_id=${payload.portfolio_id} order by ticker`, (err2, results) => {
      if (err2) {
        console.error("unable to fetch eod nav: ", err2.stack);
      }
      let balance = [];
      if (results !== undefined && results.length > 0) {
        results.map((result) => {
          result.market_price = null;
          result.mv = null;
          result.mv_percent = null;
        })
        balance = results;
      }
      callback(balance);
    })
  },
  priceFromCMC: (payload, callback) => {
    axios.get('https://api.coinmarketcap.com/v2/listings/')
      .then((data) => {
        let tickerId;
        for (var i = 0; i < data.data.data.length; i++) {
          if (data.data.data[i].symbol === payload) {
            tickerId = data.data.data[i].id;
            break;
          }
        }
        if (!isNaN(tickerId)) {
          // console.log('ticker', tickerId);
          axios.get('https://api.coinmarketcap.com/v2/ticker/' + String(tickerId) + '/')
            .then((data2) => {
              let price = parseFloat(data2.data.data.quotes.USD.price)
              if (price / 10 > 1) {
                price = price.toFixed(2);
              } else {
                price = price.toFixed(4);
              }
              callback(price)
            })
            .catch(error => {
              console.log("error from fetch cmc price", error);
              callback(null);
            })
        } else {
          callback(null);
        }
      })
      .catch(error => {
        console.log("error from fetch cmc listings", error);
        callback(null);
      });
  },
  customData: (payload, callback) => {
    if (payload.portfolio_id === 11) {
      var promise1 = db.getAsync(payload.portfolio_id + "_profits");
      var promise2 = db.getAsync(payload.portfolio_id + "_step");
      var promise3 = db.getAsync(payload.portfolio_id + "_starting_price");
      var promise4 = db.getAsync(payload.portfolio_id + "_spread");
      var promise5 = db.getAsync(payload.portfolio_id + "_qty");
      var promise6 = db.getAsync(payload.portfolio_id + "_lower_bound_price");
      var promise7 = db.getAsync(payload.portfolio_id + "_upper_bound_price");
      var promise8 = db.getAsync(payload.portfolio_id + "_pnl");
      Promise.all([promise1, promise2, promise3, promise4, promise5, promise6, promise7, promise8]).then(function (values) {
        callback({
          profits: values[0],
          step: values[1],
          starting_price: values[2],
          spread: values[3],
          qty: values[4],
          lower_bound_price: values[5],
          upper_bound_price: values[6],
          pnl: values[7]
        });
      });

    } else {
      var promise1 = db.getAsync(payload.portfolio_id + "_profits");
      var promise2 = db.getAsync(payload.portfolio_id + "_step");
      var promise3 = db.getAsync(payload.portfolio_id + "_starting_price");
      var promise4 = db.getAsync(payload.portfolio_id + "_spread");
      var promise5 = db.getAsync(payload.portfolio_id + "_qty");
      Promise.all([promise1, promise2, promise3, promise4, promise5]).then(function (values) {
        callback({
          profits: values[0],
          step: values[1],
          starting_price: values[2],
          spread: values[3],
          qty: values[4]
        });
      });
    }
  },
  initial: (payload, callback) => {

    db.pool.query(`select nav from nav_table where is_live=1 and portfolio_id=${payload.portfolio_id} order by datetime_utc limit 1`, (err2, results) => {
      if (err2) {
        console.error("unable to fetch eod nav: ", err2);
      }
      console.log("results", payload.portfolio_id, results);
      let original_nav = 0;
      if (results !== undefined && results.length > 0) {
        original_nav = results[0].nav
      }
      db.pool.query(`select sum(adjustments) as "total_adjustments" from nav_table where is_live=1 and portfolio_id=${payload.portfolio_id}`, (err3, results2) => {
        let total_adjustments = 0;
        if (results2 !== undefined && results.length > 0) {
          total_adjustments = results2[0].total_adjustments
        }
        let payload = {
          original_nav,
          total_adjustments
        }
        console.log(payload.portfolio_id, payload);
        callback(payload);
      })
    })

  },
  testdb: (payload, callback) => {
    db.pool.ping(function (err2) {
      if (err2) throw err2;
      console.log('Server responded to ping');
      callback({ results: 'ok' });
    })
  },
  getProfits: (id, callback) => {
    // get profits from redis
    db.r.get(`${id}_profits`, (err, res) => {
      callback(res)
    })
  },
  bitmex: (callback) => {
    // get profits from redis
    db.r.get(`bitmex_quantity`, (err, res) => {
      db.r.get(`bitmex_funding`, (err, res2) => {
        db.r.get(`bitmex_margin`, (err, res3) => {
          db.r.get(`bitmex_heartbeat`, (err, res4) => {
            callback({
              quantity: res,
              funding: res2,
              margin: res3,
              heartbeat: res4,
            })
          })
        })
      })
    })
  },
}
