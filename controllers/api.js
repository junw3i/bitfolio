const bcrypt = require('bcrypt');
const api = require('../models/api');
const db = require('../db');

/**
 * ===========================================
 * Controller logic
 * ===========================================
 */

const getTickers = (req, res) => {
  api.verify(req.body, (err2, results) => {
    // expects either an array or undefined
    let payload = JSON.stringify({ payload: results });
    res.status(201).send(payload);
  })
}

const saveTicker = (req, res) => {
  api.saveTicker(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const removeTicker = (req, res) => {
  api.removeTicker(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const benchmark = (req, res) => {
  api.benchmark(req.params.id, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send({payload});
  })
}

const savePortfolio = (req, res) => {
  api.savePortfolio(req.body, (results) => {
    console.log("congroller return");
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const getPortfolio = (req, res) => {
  api.getPortfolio(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const getActivities = (req, res) => {
  api.getActivities(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const getEODNav = (req, res) => {
  api.getEODNav(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const saveActivities = (req, res) => {
  api.saveActivities(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const getBalance = (req, res) => {
  api.getBalance(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const priceFromCMC = (req, res) => {
  if (req.params.id.toUpperCase() === 'USD') {
    res.status(201).send({payload: 1});
  } else {
    api.priceFromCMC(req.params.id.toUpperCase(), (results) => {
      let payload = results;
      res.status(201).send({payload});
    })
  }
}

const customData = (req, res) => {
  api.customData(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const initial = (req, res) => {
  api.initial(req.body, (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const testdb = (req, res) => {
  api.testdb("ping", (results) => {
    let payload = JSON.stringify(results);
    res.status(201).send(payload);
  })
}

const getProfits = (req, res) => {
  api.getProfits(req.params.id, (results) => {
    let payload = results
    res.status(201).send(payload);
  })
}

const bitmex = (req, res) => {
  console.log('here')
  api.bitmex((results) => {
    let payload = results
    res.status(201).send(payload)
  })
}

const binanceBook = (req, res) => {
  const pair = req.params.pair;
  api.binanceBook(pair, (results) => {
    let payload = results
    res.status(201).send(payload)
  })
}

/**
 * ===========================================
 * Export controller functions as a module
 * ===========================================
 */
 module.exports = {
   getTickers,
   saveTicker,
   removeTicker,
   benchmark,
   savePortfolio,
   getPortfolio,
   getActivities,
   getEODNav,
   saveActivities,
   getBalance,
   priceFromCMC,
   customData,
   initial,
   getProfits,
   testdb,
   bitmex,
   binanceBook,
 }
