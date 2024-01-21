const { QUEUE_COLLECT_EXECUTIONS_OUTPUT } = require("../constants/Queue");
const queue = require("../config/Queue")(QUEUE_COLLECT_EXECUTIONS_OUTPUT)
const ScriptRepository = require("../repositories/ScriptRepository")

const scriptRepository = new ScriptRepository()

queue.process(async (job, done) => {
    try {
        const { scriptId, output, type } = job.data;
        await scriptRepository.saveLogExecution({
            output,
            script_id: scriptId,
            type
        })
        console.log(`Saved exection of script with id => ${scriptId}`)
        done();
    } catch(error) {
        console.log(error)
        throw error;
    }
    
})
