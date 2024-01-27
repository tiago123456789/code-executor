require("dotenv").config()
const { execSync } = require("child_process");
const fs = require('fs');
const logger = require("./configs/Logger")
const queue = require("./configs/Queue")("build_docker_image")
const buildDockerImageCompletedQueue = require("./configs/Queue")('build_docker_image_completed')

const OPTIONS_SHELL_COMMAND = {
    stdio: ['pipe', 'pipe', 'ignore']
}

queue.process(async (job, done) => {
    try {
        let { code, id, secret_manager_token } = job.data;

        logger.info(`Starting process to build script ${id}`)
        logger.info(`Decoding code the script ${id}`)

        code = Buffer.from(code, "base64").toString("utf-8");
        code = `${code}
    
            module.exports = start
            `

        logger.info(`Saving code the script ${id} in blueprint/codes/ directory`)

        fs.writeFileSync(`./blueprint/codes/${id}.js`, code)

        logger.info(`Extracting thrid libraries of code the script ${id}`)

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
            -t ${process.env.DOCKER_HUB_USERNAME}/code-${id}:latest .
        `;

        const hasLoadEnvs = secret_manager_token != null
        if (hasLoadEnvs) {
            commandToBuild = `
                cd blueprint && \
                docker image build \
                -f DockerfileWithEnvs \
                --build-arg FILENAME="${id}.js" --build-arg MODULES_TO_INSTALL="${modules}" \
                -t ${process.env.DOCKER_HUB_USERNAME}/code-${id}:latest .
            `;
        }


        logger.info(`Building docker image with code the script ${id}`)

        execSync(commandToBuild, OPTIONS_SHELL_COMMAND)

        logger.info(`Send docker image with code the script ${id} to docker hub`)

        execSync(`
                docker push ${process.env.DOCKER_HUB_USERNAME}/code-${id}
        `, OPTIONS_SHELL_COMMAND)

        logger.info(`Removing code the script ${id} in blueprint/codes/ directory`)

        fs.rmSync(`./blueprint/codes/${id}.js`)

        logger.info(`Notify the processo to build docker image with code the script ${id} completed`)

        await buildDockerImageCompletedQueue.add({ id }, {
            attempts: 2,
            removeOnComplete: true
        })

        logger.info(`Finished process to build script ${id}`)

        done()
    } catch (error) {
        logger.error(error.message)
        throw error;
    }
});

console.log("Started consumer!!!")

