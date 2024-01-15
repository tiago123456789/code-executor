require("dotenv").config()
const { execSync } = require("child_process");

const queue = require("./configs/Queue")("scripts_run")
const collectExecutionsOutput = require("./configs/Queue")("collect_executions_output");

queue.process(async (job, done) => {
    let { id } = job.data;

    const event = (
        Buffer.from(
            JSON.stringify({ "id": 1, initialDate: "2023-01-01", finalDate: "2023-01-31" })
        ).toString("base64")
    )

    let outputScript = "";
    let type = "SUCCESS"
    try {
        const output = execSync(`docker run --rm docker.io/tiagorosadacosta123456/code-${id} node index.js ./script_to_run.js ${event}`);
        outputScript = output.toString()
        console.log(outputScript)
    } catch(error) {
        type = "ERROR"
        output = error.message
        console.log(error.message)
    } finally {
        await collectExecutionsOutput.add({
            output: outputScript,
            scriptId: id,
            type
        }, {
            attempts: 2,
            removeOnComplete: true
        })
    }
    
    done()
});

console.log("Started consumer!!!")
