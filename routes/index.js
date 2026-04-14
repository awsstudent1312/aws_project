const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.render('client.html');
  res.sendFile(__dirname + "/views/client.html");
});

module.exports = router;
