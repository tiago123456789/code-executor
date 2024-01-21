const queue = require("../config/Queue")("collect_executions_output")
const clientDB = require("../config/Database")

queue.process(async (job, done) => {
    try {
        const { scriptId, output, type } = job.data;
        await clientDB("executions")
        .insert({
            output,
            script_id: scriptId,
            type
        })
        console.log(`Saved exection of script with id => ${scriptId}`)
        done();
    } catch(error) {
        console.log(error)
    }
    
})
