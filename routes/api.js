var express = require('express');
var router = express.Router();
const api = require("../controllers/api");

// DASHBOARD

router.post("/tickers", api.getTickers);
router.post("/saveTicker", api.saveTicker);
router.post("/removeTicker", api.removeTicker);

module.exports = router;
