const express = require('express');
const router = express.Router();

const bcrypt = require("bcrypt");

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3",
  },
  debug: true,
});

router.post("/", async function (req, res, next) {
  const body = req.body;
  console.log(body);

  if (body.user == "" || body.pass == "") {
    res.json({ error: "you need to complete all input" });
    return;
  }

  try {
    const user = await knex("users").where({ name: body.user }).first();

    if (!user) {
      res.json({ error: "invalid username or password" });
      return;
    }

    const ok = await bcrypt.compare(body.pass, user.password);

    if (!ok) {
      res.json({ error: "invalid username or password" });
      return;
    }

    res.json({ msg: "login success", user: user.name });
  } catch (err) {
    console.log(err);
    res.json({ error: "server error" });
  }
});

module.exports = router;
