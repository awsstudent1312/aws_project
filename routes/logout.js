const express = require("express");
const router = express.Router();

const { knex, executeQuery } = require("/lib/db");

router.post("/", async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    res.status(400).json({ error: "missing sessionId" });
    return;
  }

  try {
    const deleted = await executeQuery(
      knex("sessions").where({ sessionId }).del(),
    );

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
