import knex from "knex";

// For SQLite
const db = knex({
  client: "sqlite3",
  connection: {
    filename: "./myAnimeList.db",
  },
  useNullAsDefault: true,
});

// For Postgres
// const db = knex({
//     client: 'pg',
//     connection: {
//         host: 'Localhost',
//         user: 'postgres',
//         password: 'postgres',
//         database: 'myAnimeList'
//     },
//     useNullAsDefault: true
// })

export default db;
