/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists("scripts", (table) => {
    table.increments("id").primary().index()
    table.text("code");
    table.timestamps();
    table.timestamp("last_execution")
    table.integer("interval_to_run")
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("scripts")
};
