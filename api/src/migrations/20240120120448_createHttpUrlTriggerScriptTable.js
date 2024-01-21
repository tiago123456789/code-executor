/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTableIfNotExists("http_urls_trigger_scripts", (table) => {
        table.increments("id").primary().index()
        table.timestamps(true, true)
        table.uuid("key").notNullable()
        table.bigInteger("code_id").notNullable()
        table.foreign("code_id").references("scripts.id")
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("http_urls_trigger_scripts")
};
