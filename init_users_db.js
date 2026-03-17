const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./db.sqlite3",
  },
  debug: true,
});

async function CreateUsers() {
  await knex.raw("drop table if exists messages");
  await knex.raw("drop table if exists users");

  await knex.schema.createTable("users", (users) => {
    users.string("name", 255).primary();
    users.string("password", 255).notNullable();
  });

  await knex.schema.createTable("messages", (messages) => {
    messages.increments("id").primary();
    messages.string("author", 255).notNullable();
    messages.text("content").notNullable();
    messages.datetime("created_at").notNullable();
  });

  await testInsertion();
}

async function testInsertion() {

  await knex("messages").insert([
    {
      author: "bo_gosse_anonyme_du_75",
      content: "Salut bb, tu viens pour une raclette ce soir",
      created_at: new Date("2026-03-17T10:00:49").toISOString(),
    },
    {
      author: "bo_gosse_anonyme_du_ciel",
      content: "hummm je sais pas trop il y a @bo_gosse_anonyme_de_mon_coeur qui veut que je l'aide pour un projet",
      created_at: new Date("2026-03-17T10:05:23").toISOString(),
    },
    {
      author: "bo_gosse_anonyme_du_75",
      content: "Dommage j'allais te présenter à mes parents",
      created_at: new Date("2026-03-17T10:10:52").toISOString(),
    },
    {
      author: "bo_gosse_anonyme_du_ciel",
      content: "un autre jours mon bb d'amour",
      created_at: new Date("2026-03-17T10:15:45").toISOString(),
    },
  ]);

  console.log("database created with test data");
  process.exit(0);
}

CreateUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});
