const knex = require("knex");
const connectionOptions = require("./Knexfile")

const clientDB = knex(connectionOptions);

module.exports = clientDB;