require("dotenv").config()
const { execSync } = require("child_process");
const fs = require('fs')
const tryOutCodeQueue = require("./configs/Queue")("try_out_code")

tryOutCodeQueue.process(async (job) => {
    let { code, sessionId, loadEnvs, token } = job.data;
    const id = sessionId;

    const eventData = job.data.event || {}
    let [finalCode, event] = await Promise.all([
        Promise.resolve(Buffer.from(code, "base64").toString("utf-8")),
        Promise.resolve(Buffer.from(
            JSON.stringify(eventData)
        ).toString("base64"))
    ])

    code = `${finalCode}

        module.exports = start
        `

    fs.writeFileSync(`./blueprint/codes/${id}.js`, code)

    let modules = (
        (code
            .toString()
            .match(/require\("([a-z1-9]){1,}"\)/gm) || [])
            .map(item => item.replace('require("', "").replace('")', ""))
    )

    modules = modules.join(" ")

    let commandToBuild = `
        cd blueprint && \
        docker image build \
        -f Dockerfile \
        --build-arg FILENAME="${id}.js" --build-arg MODULES_TO_INSTALL="${modules}" \
        -t ${process.env.DOCKER_HUB_USERNAME}/try-out-script-${id}:latest .
    `;
    let commandToRunCode = `
        docker run --rm ${process.env.DOCKER_HUB_USERNAME}/try-out-script-${id} \
        node index.js ./script_to_run.js ${event}
    `;
    if (loadEnvs) {
        commandToBuild = `
            cd blueprint && \
            docker image build \
            -f DockerfileWithEnvs \
            --build-arg FILENAME="${id}.js" --build-arg MODULES_TO_INSTALL="${modules}" \
            -t ${process.env.DOCKER_HUB_USERNAME}/try-out-script-${id}:latest .
        `;
        commandToRunCode = `
            docker run --rm ${process.env.DOCKER_HUB_USERNAME}/try-out-script-${id} \
            infisical run --token="${token}" \
            --env="prod" -- node index.js ./script_to_run.js ${event}
        `;
    }

    execSync(commandToBuild)

    fs.rmSync(`./blueprint/codes/${id}.js`)

    let outputScript = "";
    let type = "SUCCESS"
    try {
        const output = execSync(commandToRunCode);
        outputScript = output.toString()
    } catch (error) {
        type = "ERROR"
        outputScript = error.message.replace(commandToRunCode, "")
    }

    return {
        result: {
            output: outputScript,
            scriptId: id,
            type
        }
    }
})


console.log("Started consumer!!!")

