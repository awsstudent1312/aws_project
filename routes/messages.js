const express = require("express");
const router = express.Router();
const { knex, executeQuery } = require("../lib/db");

router.get("/", async function (req, res, next) {
  const start = req.query.start; //date du dernier message
  let size = req.query.size; //nombre de message demander
  if (!size) {
    size = "10";
  }
  try {
    let messages;
    if (start) {
      messages = await executeQuery(
        knex("messages")
          .select("*")
          .where("created_at", "<", start)
          .orderBy("created_at", "desc")
          .limit(size),
      );
    } else {
      messages = await executeQuery(
        knex("messages").select("*").orderBy("created_at", "desc").limit(size),
      );
    }
    messages = messages.rows;
    if (messages.length > 0) {
      res.json({
        messages: messages,
        last: messages[messages.length - 1]["created_at"],
      });
    } else {
      console.log("end of data");
      res.json({ error: "Pas de nouvelle donnée" });
    }
  } catch (err) {
    console.log(err);
    res.json({ error: err.code });
  }
});

module.exports = router;
