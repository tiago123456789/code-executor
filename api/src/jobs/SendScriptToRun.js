const clientDB = require("../config/Database");
const { TYPE_TRIGGER } = require("../utils/type");
const queue = require("../config/Queue")("scripts_run")

module.exports = async () => {
    console.log("Start process to get scripts needs to run")
    const scripts = await clientDB("scripts")
        .select([
            "id", "secret_manager_token"
        ])
        .where("enabled", true)
        .where("trigger", TYPE_TRIGGER.CRON)
        .whereRaw("extract(epoch from (CURRENT_TIMESTAMP - last_execution::timestamp)) >= interval_to_run")


    if (scripts.length == 0) {
        console.log("Finished here because don't have nothing to process")
        return;
    }

    for (let index = 0; index < scripts.length; index += 1) {
        await queue.add(scripts[index], {
            attempts: 2,
            removeOnComplete: true
        })
        await clientDB("scripts")
            .where("id", scripts[index].id)
            .update({
                last_execution: new Date()
            })
    }
    console.log("Finished process to get scripts needs to run")
}