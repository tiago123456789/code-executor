require("dotenv").config({ path: ".env" })
const logger = require("../config/Logger")
const schedule = require('node-schedule');
const sendScriptToRun = require("./SendScriptToRun");
const { CRONJOB_EXTRA_DATA } = require("../constants/Logger");

schedule.scheduleJob('*/10 * * * * *', sendScriptToRun);

logger.info("Start cronjobs", CRONJOB_EXTRA_DATA)
