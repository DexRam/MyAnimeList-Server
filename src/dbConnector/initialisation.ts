import { Knex } from "knex";
import db from "./settings";

async function initializeDatabase() {
  try {
    const hasAnimeStatus = await db.schema.hasTable("anime_status");
    if (!hasAnimeStatus) {
      await db.schema.createTable(
        "anime_status",
        (table: Knex.CreateTableBuilder) => {
          table.increments("id").primary().notNullable();
          table.string("status").notNullable();
          table.timestamps(true, true);
        }
      );
      console.log("Table 'anime_status' created.");
    }

    const hasUsers = await db.schema.hasTable("users");
    if (!hasUsers) {
      await db.schema.createTable("users", (table: Knex.CreateTableBuilder) => {
        table.increments("id").primary().notNullable();
        table.string("email").notNullable().unique();
        table.string("username").notNullable().unique();
        table.string("password").notNullable();
        table.timestamps(true, true);
      });
      console.log("Table 'users' created.");
    }

    const hasUserAnimes = await db.schema.hasTable("user_animes");
    if (!hasUserAnimes) {
      await db.schema.createTable(
        "user_animes",
        (table: Knex.CreateTableBuilder) => {
          table.increments("id").primary().notNullable();
          table
            .integer("status_id")
            .unsigned()
            .references("id")
            .inTable("anime_status");
          table.integer("user_id").unsigned().references("id").inTable("users");
          table.timestamps(true, true);
        }
      );
      console.log("Table 'user_animes' created.");
    }

    const statuses = ["Planned", "Watching", "Watched"];
    await db("anime_status")
      .insert(statuses.map((status) => ({ status })))
      .onConflict("status")
      .ignore();

    console.log("Statuses inserted or already exist.");
  } catch (error) {
    console.error("Error initializing the database:", error);
  }
}

export default initializeDatabase;
