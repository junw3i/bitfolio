var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
  request('http://www.google.com', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); // Print the HTML for the Google homepage.
  });

  // And insert something like this instead:
  res.json([{
  	id: 1,
  	username: "price"
  }, {
  	id: 2,
  	username: "prices"
  }]);
});

module.exports = router;
