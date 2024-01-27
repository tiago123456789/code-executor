const logger = require("../config/Logger")
const { QUEUE_SCRIPT_RUN } = require("../constants/Queue")
const queue = require("../config/Queue")(QUEUE_SCRIPT_RUN)
const ScriptRepository = require("../repositories/ScriptRepository")


const scriptRepository = new ScriptRepository()

module.exports = async () => {
    try {
        logger.info("Start process to get scripts needs to run")
        logger.info("Gettings scripts needs to execute now")
        const scripts = await scriptRepository.getScriptsToExecute();
        logger.info(`Total ${scripts.length} scripts needs to execute now`)

        if (scripts.length == 0) {
            logger.info("Finished here because don't have nothing to process")
            return;
        }

        logger.info(`Sending data about scripts needs to execute now to queue`)
        await queue.addBulk(scripts, {
            attempts: 2,
            removeOnComplete: true
        })

        const scriptIds = []
        for (let index = 0; index < scripts.length; index += 1) {
            scriptIds.push(scripts[index].id)
        }

        logger.info(`Updating column last_execution all scripts sended to queue`)
        await scriptRepository.updateMany(scriptIds, {
            last_execution: new Date()
        })
        logger.info("Finished process to get scripts needs to run")
    } catch (error) {
        logger.error(error.message)
    }

}