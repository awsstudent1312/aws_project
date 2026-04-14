const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");

const { knex, executeQuery } = require("./lib/db");

router.post("/", async (req, res, next) => {
  const body = req.body;
  if (!body.sessionId) {
    res.json({ error: "you need to be logged to send messages" });
    return;
  }
  const user = await executeQuery(
    knex("sessions")
      .select("user_name")
      .where({ sessionId: body.sessionId })
      .andWhere("expire_at", ">", new Date().toISOString())
      .first(),
  );
  if (!user) {
    res.json({ error: "session expired" });
    return;
  }
  console.log(body);
  try {
    await executeQuery(
      knex("messages").insert({
        author: user.user_name,
        content: body.content,
        created_at: new Date().toISOString(),
      }),
    );
  } catch (error) {
    res.json({ error: "messages non accepter" });
    return;
  } finally {
    res.json({ msg: "message sent" });
    return;
  }
});

module.exports = router;
