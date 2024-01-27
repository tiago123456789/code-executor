require("dotenv").config({ path: ".env" })
const logger = require("../config/Logger")
const { CONSUMER_EXTRA_DATA } = require("../constants/Logger")
require("./BuildDocikerImageCompletedConsumer")
require("./CollectExecutionsOutputConsumer")

logger.info("Loaded consumers!!!", CONSUMER_EXTRA_DATA)