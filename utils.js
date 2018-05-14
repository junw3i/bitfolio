const jwt = require('jsonwebtoken');

const getUserId = (token, callback) => {
  jwt.verify(token, process.env.TOKEN_KEY, function(err, decoded) {
    callback(decoded.id);
  })
}

module.exports = {
  getUserId
}
