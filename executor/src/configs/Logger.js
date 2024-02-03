const winston = require('winston')
const WinstonCloudWatch = require('winston-cloudwatch');

const filterByLevel = (level) => {
    return winston.format((input) => {
        return input.level === level ? input : false;
    });
}

const awsOptions = {
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }    
}

const logger = winston.createLogger({
    defaultMeta: { service: 'executor' },
    transports: [
        new winston.transports.Console({ level: 'info' }),
        new WinstonCloudWatch({
            level: 'error',
            logGroupName: process.env.AWS_CLOUDWATCH_LOG_NAME,
            logStreamName: process.env.AWS_CLOUDWATCH_LOG_STREAM_NAME,
            awsRegion: process.env.AWS_REGION,
            jsonMessage: true,
            awsOptions: awsOptions,
            messageFormatter: winston.format.combine(
                filterByLevel("error")(),
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
        new WinstonCloudWatch({
            level: 'info',
            logGroupName: process.env.AWS_CLOUDWATCH_LOG_NAME,
            logStreamName: process.env.AWS_CLOUDWATCH_LOG_STREAM_NAME,
            awsRegion: process.env.AWS_REGION,
            jsonMessage: true,
            awsOptions: awsOptions,
            messageFormatter: winston.format.combine(
                filterByLevel("info")(),
                winston.format.timestamp(),
                winston.format.json()
            ),
        }),
    ],
});

module.exports = logger