const Queue = require("bull")

module.exports = (queueName) => {
    return new Queue(queueName, ({
        redis: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORLD
        }
    }))
}