var express = require('express');
var router = express.Router();
var request = require('request');

router.get('/:id', function(req, res) {
  let ticker = req.params.id;
  request('https://coinmarketcap.com/exchanges/' + ticker, function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    // console.log('body:', body); // Print the HTML for the Google homepage.
    let volume;
    if (!body) {
      volume = 0;
    } else {
      let new_body = body.slice(body.search('data-currency-value'));
      let end = new_body.search('/span');
      new_body = new_body.slice(0, end);
      let NUMERIC_REGEXP_WHOLE = /[-]{0,1}[\d]*[\.]{0,1}[\d]+/g;
      volume = new_body ? new_body.match(NUMERIC_REGEXP_WHOLE).join() : 0;
    }
    res.json({
      volume
    });
  });
});

module.exports = router;
