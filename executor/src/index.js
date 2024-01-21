require("dotenv").config()
const { execSync } = require("child_process");
const { QUEUE_COLLECT_EXECUTIONS_OUTPUT, QUEUE_SCRIPT_RUN } = require("../../api/src/constants/Queue");

const queue = require("./configs/Queue")(QUEUE_SCRIPT_RUN)
const collectExecutionsOutput = require("./configs/Queue")(QUEUE_COLLECT_EXECUTIONS_OUTPUT);

queue.process(async (job, done) => {
    let { id, secret_manager_token } = job.data;

    const eventData = job.data.event || {}
    const event = (
        Buffer.from(
            JSON.stringify(eventData)
        ).toString("base64")
    )

    let outputScript = "";
    let type = "SUCCESS"
    try {

        const hasLoadEnvs = secret_manager_token != null;
        let commandToRunCode = `
            docker run --rm docker.io/tiagorosadacosta123456/code-${id} \
            node index.js ./script_to_run.js ${event}
        `;
        if (hasLoadEnvs) {
            commandToRunCode = `
            docker run --rm docker.io/tiagorosadacosta123456/code-${id} \
            infisical run --token="${secret_manager_token}" \
            --env="prod" -- node index.js ./script_to_run.js ${event}
        `;
        }

        const output = execSync(commandToRunCode);
        outputScript = output.toString()
        console.log(outputScript)
    } catch (error) {
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
