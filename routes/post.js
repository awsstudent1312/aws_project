const express = require("express");
const router = express.Router();

const { knex, executeQuery } = require("../lib/db");

const MAX_MESSAGE_LENGTH = 280;

router.post("/", async (req, res) => {
  const body = req.body;

  if (!body.sessionId) {
    return res.status(401).json({
      error: "you need to be logged to send messages",
    });
  }

  const content = (body.content || "").trim();

  if (!content) {
    return res.status(400).json({
      error: "empty message forbidden",
    });
  }

  if (content.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `message too long (${MAX_MESSAGE_LENGTH} max)`,
    });
  }

  try {
    const user = await executeQuery(
      knex("sessions")
        .select("user_name")
        .where({ sessionId: body.sessionId })
        .andWhere("expire_at", ">", new Date().toISOString())
        .first(),
    );

    if (!user || !user.rows || user.rows.length === 0) {
      return res.status(401).json({ error: "session expired" });
    }

    await executeQuery(
      knex("messages").insert({
        author: user.rows[0].user_name,
        content: content,
        created_at: new Date().toISOString(),
      }),
    );

    return res.json({ msg: "message sent" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "message not accepted" });
  }
});

module.exports = router;