const { QUEUE_SCRIPT_RUN } = require("../constants/Queue")
const queue = require("../config/Queue")(QUEUE_SCRIPT_RUN)
const ScriptRepository = require("../repositories/ScriptRepository")

const scriptRepository = new ScriptRepository()

module.exports = async () => {
    console.log("Start process to get scripts needs to run")
    const scripts = await scriptRepository.getScriptsToExecute();

    if (scripts.length == 0) {
        console.log("Finished here because don't have nothing to process")
        return;
    }

    await queue.addBulk(scripts, {
        attempts: 2,
        removeOnComplete: true
    })

    const scriptIds = []
    for (let index = 0; index < scripts.length; index += 1) {
        scriptIds.push(scripts[index].id)
    }

    await scriptRepository.updateMany(scriptIds, {
        last_execution: new Date()
    })
    console.log("Finished process to get scripts needs to run")
}