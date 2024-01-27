const logger = require("../config/Logger");
const { CONSUMER_EXTRA_DATA } = require("../constants/Logger");
const { QUEUE_COLLECT_EXECUTIONS_OUTPUT } = require("../constants/Queue");
const queue = require("../config/Queue")(QUEUE_COLLECT_EXECUTIONS_OUTPUT)
const ScriptRepository = require("../repositories/ScriptRepository")

const scriptRepository = new ScriptRepository()

queue.process(async (job, done) => {
    try {
        const { scriptId, output, type } = job.data;
        logger.info(`Saving logs of execution the script ${scriptId}`, CONSUMER_EXTRA_DATA)
        await scriptRepository.saveLogExecution({
            output,
            script_id: scriptId,
            type
        })
        logger.info(`Saved logs of execution the script ${scriptId}`, CONSUMER_EXTRA_DATA)
        done();
    } catch(error) {
        logger.error(error.message, CONSUMER_EXTRA_DATA)
        throw error;
    }
    
})
