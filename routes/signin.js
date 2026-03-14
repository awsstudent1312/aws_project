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
  if (body.pass != body.verif) {
    res.json({ error: "password isn't the same" });
    return;
  }
  await knex("users").insert({
    name: body.user,
    password: bcrypt.hashSync(body.pass, keyround),
  });
  res.json({ msg: "user added !" });
});

module.exports = router;
