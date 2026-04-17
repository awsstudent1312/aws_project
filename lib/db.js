require("dotenv").config();
const { createClient } = require("@libsql/client");

// Créez le client LibSQL pour Turso
const libsqlClient = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Fonction pour exécuter des requêtes Knex via LibSQL
const executeQuery = async (queryBuilder) => {
  const sql = queryBuilder.toQuery();
  return libsqlClient.execute({ sql, args: queryBuilder.bindings });
};

// Configurez Knex pour générer des requêtes SQL (sans connexion directe)
const knex = require("knex")({
  client: "sqlite3", // Utilisez 'sqlite3' pour la syntaxe SQL
  useNullAsDefault: true, // Désactive les avertissements spécifiques à SQLite
  debug: true, // Active le mode debug
});

module.exports = { knex, executeQuery };
