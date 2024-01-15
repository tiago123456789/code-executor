require("dotenv").config({ path: "../../.env" })

module.exports = {
    client: 'cockroachdb',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        ssl: true
    },
    migrations: {
        tableName: 'migrations',
        directory: "../migrations"
    }
}