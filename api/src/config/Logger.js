const winston = require('winston')

const filterByLevel = (level) => {
    return winston.format((input) => {
        return input.level === level ? input : false;
    });
}

const logger = winston.createLogger({
    defaultMeta: { service: 'api' },
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new winston.transports.File({
            filename: "error.log", dirname: "logs",
            level: "error",
            format: winston.format.combine(
                filterByLevel("error")(),
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
        new winston.transports.File({
            filename: "info.log", dirname: "logs",
            level: "info",
            format: winston.format.combine(
                filterByLevel("info")(),
                winston.format.timestamp(),
                winston.format.json()
            ),
        })
    ],
});

module.exports = logger