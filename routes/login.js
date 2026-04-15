const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const { knex, executeQuery } = require("../lib/db");

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 8;

function isValidUsername(username) {
  return /^[a-zA-Z0-9_.-]+$/.test(username);
}

router.post("/", async (req, res) => {
  const rawUser = req.body.user ?? "";
  const rawPass = req.body.pass ?? "";

  const user = rawUser.trim();
  const pass = String(rawPass);

  if (!user || !pass) {
    return res.status(400).json({
      error: "you need to complete all input",
    });
  }

  if (user.length < USERNAME_MIN_LENGTH || user.length > USERNAME_MAX_LENGTH) {
    return res.status(400).json({
      error: "invalid username or password",
    });
  }

  if (!isValidUsername(user)) {
    return res.status(400).json({
      error: "invalid username or password",
    });
  }

  if (pass.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({
      error: "invalid username or password",
    });
  }

  try {
    const userQuery = await executeQuery(
      knex("users").where({ name: user }).first(),
    );

    if (!userQuery || !userQuery.rows || userQuery.rows.length === 0) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }

    const dbUser = userQuery.rows[0];
    const ok = await bcrypt.compare(pass, dbUser.password);

    if (!ok) {
      return res.status(401).json({
        error: "invalid username or password",
      });
    }

    const sessionId = await session_id_in_bd(user);

    return res.json({
      msg: "login success",
      sessionId: sessionId,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "server error" });
  }
});

async function session_id_in_bd(username) {
  const sessionId = crypto.randomUUID();

  try {
    await executeQuery(
      knex("sessions").insert({
        user_name: username,
        sessionId: sessionId,
        expire_at: new Date(Date.now() + 3600000).toISOString(),
      }),
    );
  } catch (err) {
    return await session_id_in_bd(username);
  }

  return sessionId;
}

module.exports = router;