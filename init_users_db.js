const { Knex } = require("knex");
const { knex, executeQuery } = require("./lib/db");

async function CreateUsers() {
  let query = knex.raw("drop table if exists messages");
  await executeQuery(query);
  query = knex.raw("drop table if exists sessions");
  await executeQuery(query);
  query = knex.raw("drop table if exists users");
  await executeQuery(query);

  query = knex.schema.createTable("users", (users) => {
    users.string("name", 255).primary();
    users.string("password", 255).notNullable();
  });
  await executeQuery(query);

  query = knex.schema.createTable("messages", (messages) => {
    messages.increments("id").primary();
    messages.string("author", 255).notNullable();
    messages.text("content").notNullable();
    messages.datetime("created_at").notNullable();
  });
  await executeQuery(query);

  query = knex.schema.createTable("sessions", (sessions) => {
    sessions.bigInteger("sessionId").primary();
    sessions.string("user_name").notNullable();
    sessions.datetime("expire_at").notNullable();
    sessions.foreign("user_name").references("name").inTable("users");
  });
  await executeQuery(query);

  await testInsertion();
  await testSelect();
  process.exit(0);
}

async function testInsertion() {
  await executeQuery(
    knex("messages").insert([
      {
        author: "bo_gosse_anonyme_du_75",
        content: "Salut bb, tu viens pour une raclette ce soir",
        created_at: new Date("2026-03-17T10:00:49").toISOString(),
      },
      {
        author: "bo_gosse_anonyme_du_ciel",
        content:
          "hummm je sais pas trop il y a @bo_gosse_anonyme_de_mon_coeur qui veut que je l'aide pour un projet",
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
    ]),
  );
  // await executeQuery(query);

  console.log("database created with test data");
  // process.exit(0);
}

async function testSelect() {
  let rep = await executeQuery(knex("messages").select("*"));
  console.log(rep);
  rep = await executeQuery(knex("users").select("*"));
  console.log(rep);
  process.exit(0);
}

testSelect().catch((err) => {
  console.error(err);
  process.exit(1);
});

// CreateUsers().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
