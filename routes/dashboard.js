var express = require('express');
var router = express.Router();
const dashboard = require("../controllers/dashboard");

// DASHBOARD

router.post("/tickers", dashboard.getTickers);

module.exports = router;
