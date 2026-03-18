const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3",
  },
  debug: true,
});

router.post("/", async (req, res, next) => {
  const body = req.body;
  if (!body.password || !body.user) {
    res.json({ error: "you need to be logged to send messages" });
    return;
  }
  const user = await knex("users")
    .select("password")
    .where({ name: body.user })
    .first();
  if (!user) {
    res.json({error: "invalide username or password"});
    return;
  }
  console.log(body);
  if (!bcrypt.compareSync(body.password, user.password)) {
    res.json({ error: "invalide credentials" });
  } else {
    try {
      await knex("messages").insert({
        author: body.user,
        content: body.content,
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      res.json({ error: "messages non accepter" });
      return;
    } finally {
    }
    res.json({ msg: "message sent" });
    return;
  }
});

module.exports = router;
