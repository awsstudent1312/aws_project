const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3",
  },
  debug: true,
});

async function CreateUsers() {
  await knex.raw("drop table if exists users");
  await knex.schema.createTable("users", (users) => {
    users.string("name", 255).primary();
    users.string("password", 255).notNullable();
  });
}

CreateUsers();
