const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const keyround = 10;

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3",
  },
  debug: true,
});

router.post("/", async (req, res, next) => {
  const body = req.body;
  console.log(body);
  if (body.pass == "" || body.user == "") {
    res.json({ error: "you need to complete all the input" });
  }
  if (body.pass != body.verif) {
    res.json({ error: "password isn't the same" });
    return;
  }
  try {
    await knex("users").insert({
      name: body.user,
      password: bcrypt.hashSync(body.pass, keyround),
    });
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
