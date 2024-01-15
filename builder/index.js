const { execSync } = require("child_process");
const fs = require('fs')
const queue = require("./configs/Queue")("build_docker_image")
const buildDockerImageCompletedQueue = require("./configs/Queue")("build_docker_image_completed")

queue.process(async (job, done) => {
    let { code, id } = job.data;

    code = Buffer.from(code, "base64").toString("utf-8");
    code = `${code}

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

    execSync(`
            cd blueprint && \
            docker image build --build-arg FILENAME="${id}.js" --build-arg MODULES_TO_INSTALL="${modules}" \
            -t tiagorosadacosta123456/code-${id} .
        `)

    execSync(`
            docker push tiagorosadacosta123456/code-${id}
        `)

    fs.rmSync(`./blueprint/codes/${id}.js`)
    await buildDockerImageCompletedQueue.add({ id }, {
        attempts: 2,
        removeOnComplete: true
    })
    done()
});

console.log("Started consumer!!!")

