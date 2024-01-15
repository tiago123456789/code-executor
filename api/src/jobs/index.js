require("dotenv").config({ path: ".env" })
const schedule = require('node-schedule');
const sendScriptToRun = require("./SendScriptToRun");

schedule.scheduleJob('*/10 * * * * *', sendScriptToRun);

