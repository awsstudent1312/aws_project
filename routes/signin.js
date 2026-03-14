const express = require('express');
const router = express.Router();

/* GET home page. */
router.post('/', function(req, res, next) {
  res.send('<h1>Signin</h1>');
});

module.exports = router;
