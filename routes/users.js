var express = require('express');
var router = express.Router();
const users = require("../controllers/users");

// USERS

router.post("/create", users.create);
router.post("/login", users.login)
router.get("/logout", users.logout);

module.exports = router;
