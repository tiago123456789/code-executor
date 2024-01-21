const logger  = {
    info(...args) {
        console.log(new Date(), "[INFO]", ...args)
    },
    
    log(...args) {
        console.log(new Date(), `[LOG]`, ...args)
    },

    error(...args) {
        console.error(new Date(), `[ERROR]`, ...args)
    }
}

let event = {};
if (process.argv[3]) {
    event = Buffer.from(process.argv[3], "base64").toString("utf-8")
    event = JSON.parse(event)
}

const functionToRun = require(process.argv[2])
functionToRun(event, logger)