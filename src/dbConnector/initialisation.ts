import { Knex } from 'knex';
import db from "./settings";

db.schema.hasTable('users').then((exists: boolean) => {
    if (!exists) {
        return db.schema.createTable('users', (table: Knex.CreateTableBuilder) => {
            table.increments('id').unique().primary().notNullable();
            table.string('email').notNullable().unique();
            table.string('username').notNullable().unique();
            table.integer('password').notNullable();
            table.timestamps(true, true);
        });
    }
});


db.schema.hasTable('user_anime').then((exists: boolean) => {
    if (!exists) {
        return db.schema.createTable('user_animes', (table: Knex.CreateTableBuilder) => {
            table.increments('id').unique().primary().notNullable();
            table.foreign('status_id').references('id').inTable('anime_status');
            table.foreign('user_id').references('id').inTable('users');
            table.timestamps(true, true);
        });
    }
});

db.schema.hasTable('anime_status').then((exists: boolean) => {
    if (!exists) {
        return db.schema.createTable('anime_status', (table: Knex.CreateTableBuilder) => {
            table.increments('id').unique().primary().notNullable();
            table.string('status').notNullable();
            table.timestamps(true, true);
        });
    }
});

const statuses = ['Planned', 'Watching', 'Watched'];

statuses.forEach(status => {
    db('anime_status').select('status').where({ status }).first().then((existingStatus: { status: string } | null) => {
        if (!existingStatus) {
            return db('anime_status').insert({ status });
        }
    }).catch((error: Error) => {
        console.error(`Error checking or inserting status ${status}:`, error);
    });
});
