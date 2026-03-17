const express = require("express");
const router = express.Router();

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3",
  },
  debug: true,
});

router.get("/", async function (req, res, next) {
  try {
    const messages = await knex("messages").select("*").orderBy("created_at", "asc");
    res.json(messages);
  } catch (err) {
    console.log(err);
    res.json({ error: err.code });
  }
});

module.exports = router;