const express = require("express");
const router = express.Router();

const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3",
  },
  debug: true,
});

router.post("/", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    res.status(400).json({ error: "missing sessionId" });
    return;
  }

  try {
    const deleted = await knex("sessions").where({ sessionId }).del();

    if (deleted === 0) {
      res.status(401).json({ error: "invalid session" });
      return;
    }

    res.json({ msg: "logout success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;