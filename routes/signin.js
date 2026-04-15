const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const keyround = 10;

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
  const rawVerif = req.body.verif ?? "";

  const user = rawUser.trim();
  const pass = String(rawPass);
  const verif = String(rawVerif);

  if (!user || !pass || !verif) {
    return res.status(400).json({
      error: "vous devez compléter toutes les entrées",
    });
  }

  if (user.length < USERNAME_MIN_LENGTH) {
    return res.status(400).json({
      error: `username doit contenir au moins ${USERNAME_MIN_LENGTH} caractères`,
    });
  }

  if (user.length > USERNAME_MAX_LENGTH) {
    return res.status(400).json({
      error: `username doit contenir au plus ${USERNAME_MAX_LENGTH} caractères`,
    });
  }

  if (!isValidUsername(user)) {
    return res.status(400).json({
      error: "username peut uniquement contenir des lettres, nombres, _, - et .",
    });
  }

  if (pass.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({
      error: `password doit être au moins de ${PASSWORD_MIN_LENGTH} caractères`,
    });
  }

  if (pass !== verif) {
    return res.status(400).json({
      error: "password et confirmer password ne sont pas les mêmes",
    });
  }

  try {
    await executeQuery(
      knex("users").insert({
        name: user,
        password: bcrypt.hashSync(pass, keyround),
      }),
    );

    return res.status(201).json({ msg: "user ajouter !" });
  } catch (err) {
    console.log(err);

    if (err.errno == 19 || err.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({
        error: `user:${user} existe deja`,
      });
    }

    return res.status(500).json({ error: "server error" });
  }
});

module.exports = router;