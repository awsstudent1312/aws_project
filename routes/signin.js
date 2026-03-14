const express = require("express");
const router = express.Router();

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
    res.json({ error: "you need to complete all input" });
    return;
  }
  if (body.pass != body.verif) {
    res.json({ error: "password isn't the same" });
    return;
  }
  try {
    await knex("users").insert({ name: body.user, password: body.pass });
  } catch (error) {
    res.json({ error: error.code });
    return;
  }
  res.json({ msg: "user added !" });
});

module.exports = router;
