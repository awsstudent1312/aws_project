const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const keyround = 10;

const { knex, executeQuery } = require("/lib/db");

router.post("/", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (body.pass == "" || body.user == "") {
    res.json({ error: "you need to complete all input" });
    return;
  }
  if (body.pass != body.verif) {
    res.json({ error: "password isn't the same" });
    return;
  }
  try {
    await executeQuery(
      knex("users").insert({
        name: body.user,
        password: bcrypt.hashSync(body.pass, keyround),
      }),
    );
  } catch (err) {
    console.log(err);
    if (err.errno == 19) {
      res.json({ error: `user:${body.user} already exist` });
    } else {
      res.json({ error: err.code });
    }
    return;
  }

  res.json({ msg: "user added !" });
});

module.exports = router;
