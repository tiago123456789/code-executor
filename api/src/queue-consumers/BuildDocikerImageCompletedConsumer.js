const logger = require("../config/Logger")
const { QUEUE_BUILD_DOCKER_IMAGE_COMPLETED } = require("../constants/Queue");
const queue = require("../config/Queue")(QUEUE_BUILD_DOCKER_IMAGE_COMPLETED)
const ScriptRepository = require("../repositories/ScriptRepository")

const scriptRepository = new ScriptRepository()

queue.process(async (job, done) => {
    try {
        const { id } = job.data;
        logger.info(`Starting to process to update script with id ${id} to enabled`, CONSUMER_EXTRA_DATA)
        await scriptRepository.updateMany([id], {
            enabled: true
        })
        logger.info(`Enabled script with id ${id} successfully`, CONSUMER_EXTRA_DATA)
        done();
    } catch (error) {
        logger.error(error.message, CONSUMER_EXTRA_DATA)
        throw error
    }
})