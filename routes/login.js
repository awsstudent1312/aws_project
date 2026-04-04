const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { type } = require("os");

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
    const sessionId = await session_id_in_bd(body.user);
    res.json({
      msg: "login success",
      sessionId: sessionId,
    });
  } catch (err) {
    console.log(err);
    res.json({ error: "server error" });
  }
});

async function session_id_in_bd(username) {
  const sessionId = crypto.randomUUID();
  console.log(type(sessionId));
  try {
    await knex("sessions").insert({
      user_name: username,
      sessionId: sessionId,
      expire_at: new Date(Date.now() + 3600000).toISOString(),
    });
  } catch (err) {
    return await session_id_in_bd(username);
  }
  return sessionId;
}
module.exports = router;
