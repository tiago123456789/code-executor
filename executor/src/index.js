require("dotenv").config()
const { execSync } = require("child_process");
const queue = require("./configs/Queue")('scripts_run')
const collectExecutionsOutput = require("./configs/Queue")('collect_executions_output');
const logger = require("./configs/Logger")

queue.process(async (job, done) => {
    let { id, secret_manager_token } = job.data;
    logger.info(`Starting process to execute code ${id}`)

    logger.info(`Transform event to base64 to use in code ${id}`)

    const eventData = job.data.event || {}
    const event = (
        Buffer.from(
            JSON.stringify(eventData)
        ).toString("base64")
    )

    let outputScript = "";
    let type = "SUCCESS"
    try {

        logger.info(`Executing code ${id}`)

        const hasLoadEnvs = secret_manager_token != null;
        let commandToRunCode = `
            docker run --rm ${process.env.DOCKER_HUB_USERNAME}/code-${id} \
            node index.js ./script_to_run.js ${event}
        `;
        if (hasLoadEnvs) {
            commandToRunCode = `
            docker run --rm ${process.env.DOCKER_HUB_USERNAME}/code-${id} \
            infisical run --token="${secret_manager_token}" \
            --env="prod" -- node index.js ./script_to_run.js ${event}
        `;
        }

        const output = execSync(commandToRunCode);
        outputScript = output.toString()
    } catch (error) {
        logger.error(error.message)
        type = "ERROR"
        output = error.message
    } finally {
        logger.info(`Send output execution of code ${id}`)
        await collectExecutionsOutput.add({
            output: outputScript,
            scriptId: id,
            type
        }, {
            attempts: 2,
            removeOnComplete: true
        })
    }

    logger.info(`Finished process to execute code ${id}`)
    done()
});

console.log("Started consumer!!!")
