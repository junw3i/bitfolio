var express = require('express');
var router = express.Router();
const api = require("../controllers/api");
const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
  if (req.body.token === 'undefined') {
    res.sendStatus(403);
  } else {
    jwt.verify(req.body.token, process.env.TOKEN_KEY, function(err, decoded) {
      if (decoded.id === 'undefined') {
        res.sendStatus(403);
      } else {
        req.body.user_id = decoded.id;
        next();
      }
    });
  }
}

// DASHBOARD

router.post("/tickers", verify, api.getTickers);
router.post("/saveTicker", verify, api.saveTicker);
router.post("/removeTicker", api.removeTicker);
router.get("/benchmark/daily/:id", api.benchmark);

router.post("/portfolio/save", verify, api.savePortfolio);
router.post("/portfolio/get", verify, api.getPortfolio);
router.post("/portfolio/activity", verify, api.getActivities);
router.post("/portfolio/eodnav", verify, api.getEODNav);
router.post("/portfolio/balance", verify, api.getBalance);

router.post("/trades/get", api.getActivities);
router.post("/trades/save", verify, api.saveActivities);

router.get("/price/crypto/:id", api.priceFromCMC);

router.post("/custom/data", verify, api.customData);
router.post("/custom/initial", verify, api.initial);

router.get("/test", (req, res) => {
  res.status(201).send("ok");
});

router.get("/testdb", api.testdb);

module.exports = router;
