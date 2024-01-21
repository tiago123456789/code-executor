/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.table("scripts", (table) => {
        table.enum("trigger", ["CRON", "HTTP"]).defaultTo("CRON").notNullable()
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.table("scripts", (table) => {
        table.dropColumn("trigger")
    })
};
