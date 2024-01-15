/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTableIfNotExists("executions", (table) => {
        table.increments("id").primary().index()
        table.text("output");
        table.enum("type", ["ERROR", "SUCCESS"]).notNullable();
        table.bigInteger("script_id").references("id").inTable("scripts").notNullable()
        table.timestamps();
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTableIfExists("executions")
};
