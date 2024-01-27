require("dotenv").config({ path: ".env" })
const logger = require("../config/Logger")
const schedule = require('node-schedule');
const sendScriptToRun = require("./SendScriptToRun");

schedule.scheduleJob('*/10 * * * * *', sendScriptToRun);

logger.info("Start cronjobs")
