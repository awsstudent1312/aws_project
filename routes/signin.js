const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
  res.send("<h1>Signin</h1>");
});

module.exports = router;
