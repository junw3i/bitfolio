var express = require('express');
var router = express.Router();
var request = require('request');

// get YAHOO PRICE
router.get('/:id', function(req, res) {
  let ticker = req.params.id;
  request('https://finance.yahoo.com/quote/' + ticker, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status

    let new_body = body.slice(body.search('QuoteSummaryStore'));
    new_body = new_body.slice(new_body.search('regularMarketPrice'));
    let start = new_body.search('raw');
    let end = new_body.search('fmt');
    new_body = new_body.slice(start, end);
    let NUMERIC_REGEXP = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
    let raw_match = new_body.match(NUMERIC_REGEXP);
    let price = raw_match ? raw_match[0] : 0;
    res.json({
      price
    });
  });
});

module.exports = router;
